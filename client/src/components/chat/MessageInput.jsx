import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    Box,
    TextField,
    IconButton,
    InputAdornment
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import EmojiPicker from 'emoji-picker-react';
import { sendChatMessage } from '../../actions/chat';
import { socket } from '../../socket';

export default function MessageInput({ conversationId, recipientEmail }) {
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');
    const [showEmoji, setShowEmoji] = useState(false);
    const typingTimeoutRef = useRef(null);
    const isTypingRef = useRef(false);
    const inputRef = useRef(null);

    const handleTyping = () => {
        if (!isTypingRef.current && recipientEmail) {
            isTypingRef.current = true;
            socket.emit('typing', { conversationId, recipientEmail });
        }

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set new timeout to stop typing
        typingTimeoutRef.current = setTimeout(() => {
            isTypingRef.current = false;
            socket.emit('stopTyping', { conversationId, recipientEmail });
        }, 2000);
    };

    const handleSend = () => {
        if (message.trim()) {
            dispatch(sendChatMessage(conversationId, message.trim()));
            setMessage('');
            setShowEmoji(false);

            // Clear typing indicator
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            isTypingRef.current = false;
            socket.emit('stopTyping', { conversationId, recipientEmail });

            // Focus back on input
            inputRef.current?.focus();
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleEmojiClick = (emojiData) => {
        setMessage(prev => prev + emojiData.emoji);
        inputRef.current?.focus();
    };

    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    return (
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', position: 'relative' }}>
            {showEmoji && (
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: '100%',
                        right: 16,
                        zIndex: 1000
                    }}
                >
                    <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        height={300}
                        width={300}
                        searchDisabled
                        previewConfig={{ showPreview: false }}
                    />
                </Box>
            )}
            <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder="Type a message..."
                value={message}
                inputRef={inputRef}
                onChange={(e) => {
                    setMessage(e.target.value);
                    handleTyping();
                }}
                onKeyPress={handleKeyPress}
                size="small"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                size="small"
                                onClick={() => setShowEmoji(!showEmoji)}
                            >
                                <AddReactionIcon />
                            </IconButton>
                            <IconButton
                                size="small"
                                onClick={handleSend}
                                disabled={!message.trim()}
                                color={message.trim() ? 'primary' : 'default'}
                            >
                                <SendIcon />
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />
        </Box>
    );
}
