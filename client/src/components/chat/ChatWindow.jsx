import React from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import ChatWindowHeader from './ChatWindowHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

export default function ChatWindow() {
    const { activeConversation, typingUsers } = useSelector(state => state.chat);

    if (!activeConversation) return null;

    const isTyping = typingUsers[activeConversation._id] || false;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <ChatWindowHeader conversation={activeConversation} />
            <MessageList />
            {isTyping && <TypingIndicator />}
            <MessageInput
                conversationId={activeConversation._id}
                recipientEmail={activeConversation.friend?.email}
            />
        </Box>
    );
}
