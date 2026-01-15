import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import User from "../models/user.js";
import { io } from '../index.js';
import logger from '../utils/logger.js';

// Helper: Check if two users are friends
const areFriends = async (userEmail, friendEmail) => {
    const user = await User.findOne({ email: userEmail });
    return user?.friends?.some(f => f.email === friendEmail) || false;
};

// Helper: Get sorted participants array for consistent lookups
const getSortedParticipants = (email1, email2) => [email1, email2].sort();

// Helper: Get unread count for a user from the array
const getUnreadForUser = (unreadCounts, email) => {
    if (!unreadCounts || !Array.isArray(unreadCounts)) return 0;
    const entry = unreadCounts.find(u => u.email === email);
    return entry?.count || 0;
};

// Helper: Set unread count for a user in the array
const setUnreadForUser = (conversation, email, count) => {
    const entry = conversation.unreadCounts.find(u => u.email === email);
    if (entry) {
        entry.count = count;
    } else {
        conversation.unreadCounts.push({ email, count });
    }
};

// GET /chat/conversations - Get all conversations for current user
export const getConversations = async (req, res) => {
    const { userEmail } = req;

    try {
        const conversations = await Conversation.find({
            participants: userEmail
        }).sort({ updatedAt: -1 });

        // Enrich with friend info
        const user = await User.findOne({ email: userEmail });
        const enrichedConversations = conversations.map(conv => {
            const friendEmail = conv.participants.find(p => p !== userEmail);
            const friend = user?.friends?.find(f => f.email === friendEmail);
            return {
                ...conv.toObject(),
                friend: friend || { email: friendEmail, name: 'Unknown', picture: null },
                unreadCount: getUnreadForUser(conv.unreadCounts, userEmail)
            };
        });

        return res.status(200).json({
            success: true,
            conversations: enrichedConversations
        });
    } catch (error) {
        logger.error('Get conversations error', { error: error.message, stack: error.stack });
        return res.status(500).json({
            success: false,
            message: "Failed to fetch conversations"
        });
    }
};

// GET /chat/conversation/:friendEmail - Get or create conversation with friend
export const getOrCreateConversation = async (req, res) => {
    const { userEmail } = req;
    const { friendEmail } = req.params;

    logger.info('Opening conversation', { userEmail, friendEmail });

    try {
        // Verify friendship - case insensitive comparison
        const user = await User.findOne({ email: userEmail });
        const isFriend = user?.friends?.some(f =>
            f.email?.toLowerCase() === friendEmail?.toLowerCase()
        ) || false;

        if (!isFriend) {
            logger.warn('Friendship check failed', { userEmail, friendEmail, userFriends: user?.friends?.map(f => f.email) });
            return res.status(403).json({
                success: false,
                message: "You can only chat with friends"
            });
        }

        const participants = getSortedParticipants(userEmail, friendEmail);

        // Find conversation where both participants are present (using $all for array match)
        let conversation = await Conversation.findOne({
            participants: { $all: participants }
        });

        if (!conversation) {
            conversation = new Conversation({
                participants,
                unreadCounts: [
                    { email: userEmail, count: 0 },
                    { email: friendEmail, count: 0 }
                ]
            });
            await conversation.save();
            logger.info('Conversation created', { participants });
        }

        // Get friend info from the user's friend list (more reliable)
        const friendInfo = user?.friends?.find(f =>
            f.email?.toLowerCase() === friendEmail?.toLowerCase()
        );

        return res.status(200).json({
            success: true,
            conversation: {
                ...conversation.toObject(),
                friend: {
                    email: friendInfo?.email || friendEmail,
                    name: friendInfo?.name || 'Unknown',
                    picture: friendInfo?.picture || null
                },
                unreadCount: getUnreadForUser(conversation.unreadCounts, userEmail)
            }
        });
    } catch (error) {
        console.error('Get/create conversation error:', error);
        logger.error('Get/create conversation error', {
            error: error.message,
            stack: error.stack,
            userEmail,
            friendEmail
        });
        return res.status(500).json({
            success: false,
            message: "Failed to get conversation"
        });
    }
};

// GET /chat/messages/:conversationId - Get paginated messages
export const getMessages = async (req, res) => {
    const { userEmail } = req;
    const { conversationId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;

    try {
        const conversation = await Conversation.findById(conversationId);

        if (!conversation || !conversation.participants.includes(userEmail)) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });
        }

        const skip = (page - 1) * limit;
        const total = await Message.countDocuments({ conversationId });

        const messages = await Message.find({ conversationId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            success: true,
            messages: messages.reverse(), // Return in chronological order
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            hasMore: skip + messages.length < total
        });
    } catch (error) {
        logger.error('Get messages error', { error: error.message, stack: error.stack });
        return res.status(500).json({
            success: false,
            message: "Failed to fetch messages"
        });
    }
};

// POST /chat/message - Send a message
export const sendMessage = async (req, res) => {
    const { userEmail } = req;
    const { conversationId, content } = req.body;

    try {
        const conversation = await Conversation.findById(conversationId);

        if (!conversation || !conversation.participants.includes(userEmail)) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });
        }

        const recipientEmail = conversation.participants.find(p => p !== userEmail);

        // Verify still friends
        if (!await areFriends(userEmail, recipientEmail)) {
            return res.status(403).json({
                success: false,
                message: "You can only chat with friends"
            });
        }

        // Create message
        const message = new Message({
            conversationId,
            sender: userEmail,
            content,
            readBy: [userEmail]
        });
        await message.save();

        // Update conversation
        conversation.lastMessage = {
            content: content.substring(0, 100),
            sender: userEmail,
            timestamp: new Date()
        };
        conversation.updatedAt = new Date();

        // Increment unread count for recipient
        const currentUnread = getUnreadForUser(conversation.unreadCounts, recipientEmail);
        setUnreadForUser(conversation, recipientEmail, currentUnread + 1);
        await conversation.save();

        // Get sender info for real-time update
        const sender = await User.findOne({ email: userEmail });

        // Emit to recipient via Socket.IO
        const roomSockets = io.sockets.adapter.rooms.get(recipientEmail);
        logger.info('Emitting newMessage to recipient', {
            recipientEmail,
            roomExists: !!roomSockets,
            socketsInRoom: roomSockets?.size || 0
        });

        io.to(recipientEmail).emit('newMessage', {
            message: message.toObject(),
            conversation: {
                _id: conversation._id,
                lastMessage: conversation.lastMessage,
                unreadCount: currentUnread + 1
            },
            sender: {
                email: sender?.email || userEmail,
                name: sender?.name || 'Unknown',
                picture: sender?.picture || null
            }
        });

        logger.info('Message sent', { conversationId, sender: userEmail, recipient: recipientEmail });

        return res.status(201).json({
            success: true,
            message: message.toObject()
        });
    } catch (error) {
        logger.error('Send message error', { error: error.message, stack: error.stack });
        return res.status(500).json({
            success: false,
            message: "Failed to send message"
        });
    }
};

// PATCH /chat/read/:conversationId - Mark messages as read
export const markAsRead = async (req, res) => {
    const { userEmail } = req;
    const { conversationId } = req.params;

    try {
        const conversation = await Conversation.findById(conversationId);

        if (!conversation || !conversation.participants.includes(userEmail)) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });
        }

        // Mark all messages as read
        await Message.updateMany(
            { conversationId, readBy: { $ne: userEmail } },
            { $addToSet: { readBy: userEmail } }
        );

        // Reset unread count
        setUnreadForUser(conversation, userEmail, 0);
        await conversation.save();

        // Notify other participant about read status
        const otherEmail = conversation.participants.find(p => p !== userEmail);
        io.to(otherEmail).emit('messagesRead', {
            conversationId,
            readBy: userEmail
        });

        return res.status(200).json({
            success: true,
            message: "Messages marked as read"
        });
    } catch (error) {
        logger.error('Mark as read error', { error: error.message, stack: error.stack });
        return res.status(500).json({
            success: false,
            message: "Failed to mark messages as read"
        });
    }
};

// GET /chat/unread-count - Get total unread message count
export const getUnreadCount = async (req, res) => {
    const { userEmail } = req;

    try {
        const conversations = await Conversation.find({
            participants: userEmail
        });

        const totalUnread = conversations.reduce((sum, conv) => {
            return sum + getUnreadForUser(conv.unreadCounts, userEmail);
        }, 0);

        return res.status(200).json({
            success: true,
            unreadCount: totalUnread
        });
    } catch (error) {
        logger.error('Get unread count error', { error: error.message, stack: error.stack });
        return res.status(500).json({
            success: false,
            message: "Failed to get unread count"
        });
    }
};
