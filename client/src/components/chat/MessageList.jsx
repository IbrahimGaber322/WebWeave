import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import MessageBubble from './MessageBubble';
import { fetchMessages } from '../../actions/chat';

export default function MessageList() {
    const dispatch = useDispatch();
    const messagesEndRef = useRef(null);
    const { messages, activeConversation, isLoading, hasMoreMessages, currentPage } = useSelector(state => state.chat);
    const user = useSelector(state => state.user);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleLoadMore = () => {
        if (activeConversation && hasMoreMessages && !isLoading) {
            dispatch(fetchMessages(activeConversation._id, currentPage + 1));
        }
    };

    if (isLoading && messages.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <CircularProgress size={30} />
            </Box>
        );
    }

    if (messages.length === 0) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1, p: 3 }}>
                <Typography variant="body1" color="text.secondary" textAlign="center">
                    No messages yet
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
                    Send a message to start the conversation
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                flex: 1,
                overflow: 'auto',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1
            }}
        >
            {hasMoreMessages && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    <Button
                        size="small"
                        onClick={handleLoadMore}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={20} /> : 'Load older messages'}
                    </Button>
                </Box>
            )}
            {messages.map((message, index) => (
                <MessageBubble
                    key={message._id || index}
                    message={message}
                    isOwn={message.sender === user?.email}
                    showAvatar={
                        index === 0 ||
                        messages[index - 1]?.sender !== message.sender
                    }
                />
            ))}
            <div ref={messagesEndRef} />
        </Box>
    );
}
