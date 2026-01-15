import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, IconButton, Avatar, Typography, Badge } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { closeConversation } from '../../actions/chat';

export default function ChatWindowHeader({ conversation }) {
    const dispatch = useDispatch();
    const { onlineUsers } = useSelector(state => state.chat);

    const friend = conversation?.friend;
    const isOnline = onlineUsers[friend?.email] || false;

    const handleBack = () => {
        dispatch(closeConversation());
    };

    return (
        <Box
            sx={{
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                borderBottom: 1,
                borderColor: 'divider',
                backgroundColor: 'background.paper'
            }}
        >
            <IconButton onClick={handleBack} sx={{ mr: 1 }}>
                <ArrowBackIcon />
            </IconButton>
            <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                sx={{
                    '& .MuiBadge-badge': {
                        backgroundColor: isOnline ? '#44b700' : '#bdbdbd',
                        color: isOnline ? '#44b700' : '#bdbdbd',
                        boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}`,
                    }
                }}
            >
                <Avatar src={friend?.picture} alt={friend?.name} sx={{ width: 40, height: 40 }}>
                    {friend?.name?.charAt(0) || '?'}
                </Avatar>
            </Badge>
            <Box sx={{ ml: 1.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                    {friend?.name || 'Unknown'}
                </Typography>
                <Typography variant="caption" color={isOnline ? 'success.main' : 'text.secondary'}>
                    {isOnline ? 'Online' : 'Offline'}
                </Typography>
            </Box>
        </Box>
    );
}
