import express from "express";
import {
    getConversations,
    getOrCreateConversation,
    getMessages,
    sendMessage,
    markAsRead,
    getUnreadCount
} from "../controllers/chat.js";
import user from "../middleware/user.js";
import {
    getConversationValidation,
    getMessagesValidation,
    sendMessageValidation,
    markAsReadValidation
} from "../middleware/validators/chatValidators.js";

const router = express.Router();

// All chat routes require authentication
router.get('/conversations', user, getConversations);
router.get('/conversation/:friendEmail', user, getConversationValidation, getOrCreateConversation);
router.get('/messages/:conversationId', user, getMessagesValidation, getMessages);
router.post('/message', user, sendMessageValidation, sendMessage);
router.patch('/read/:conversationId', user, markAsReadValidation, markAsRead);
router.get('/unread-count', user, getUnreadCount);

export default router;
