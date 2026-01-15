import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Drawer, Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import {
    fetchConversations,
    clearChat,
    receiveMessage,
    setTyping,
    clearTyping,
    setOnlineStatus,
    fetchUnreadCount
} from '../../actions/chat';
import { socket } from '../../socket';

export default function ChatDrawer({ open, onClose }) {
    const dispatch = useDispatch();
    const { activeConversation, conversations } = useSelector(state => state.chat);
    const user = useSelector(state => state.user);

    useEffect(() => {
        if (open && user) {
            dispatch(fetchConversations());
            dispatch(fetchUnreadCount());
        }
    }, [open, user, dispatch]);

    // Socket event listeners
    useEffect(() => {
        if (!user) return;

        const handleNewMessage = (data) => {
            dispatch(receiveMessage(data.message));
            dispatch(fetchConversations());
            dispatch(fetchUnreadCount());
        };

        const handleTyping = ({ conversationId }) => {
            dispatch(setTyping(conversationId));
        };

        const handleStopTyping = ({ conversationId }) => {
            dispatch(clearTyping(conversationId));
        };

        const handleOnline = ({ email }) => {
            dispatch(setOnlineStatus(email, true));
        };

        const handleOffline = ({ email }) => {
            dispatch(setOnlineStatus(email, false));
        };

        socket.on('newMessage', handleNewMessage);
        socket.on('userTyping', handleTyping);
        socket.on('userStopTyping', handleStopTyping);
        socket.on('userOnline', handleOnline);
        socket.on('userOffline', handleOffline);

        // Check initial online status of friends
        const friendEmails = user.friends?.map(f => f.email) || [];
        if (friendEmails.length > 0) {
            socket.emit('checkOnline', friendEmails, (statuses) => {
                Object.entries(statuses).forEach(([email, isOnline]) => {
                    dispatch(setOnlineStatus(email, isOnline));
                });
            });
        }

        return () => {
            socket.off('newMessage', handleNewMessage);
            socket.off('userTyping', handleTyping);
            socket.off('userStopTyping', handleStopTyping);
            socket.off('userOnline', handleOnline);
            socket.off('userOffline', handleOffline);
        };
    }, [user, dispatch]);

    const handleClose = () => {
        dispatch(clearChat());
        onClose();
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={handleClose}
            PaperProps={{
                sx: { width: { xs: '100%', sm: 400 } }
            }}
        >
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: 1,
                    borderColor: 'divider'
                }}>
                    <Typography variant="h6">Messages</Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {activeConversation ? (
                    <ChatWindow />
                ) : (
                    <ConversationList conversations={conversations} />
                )}
            </Box>
        </Drawer>
    );
}
