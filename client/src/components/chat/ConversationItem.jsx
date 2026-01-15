import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Badge,
    Typography,
    Box
} from '@mui/material';
import moment from 'moment';
import { openConversation } from '../../actions/chat';

export default function ConversationItem({ conversation, currentUserEmail }) {
    const dispatch = useDispatch();
    const { onlineUsers } = useSelector(state => state.chat);

    const friend = conversation.friend;
    const isOnline = onlineUsers[friend?.email] || false;
    const unreadCount = conversation.unreadCount || 0;
    const lastMessage = conversation.lastMessage;

    const handleClick = () => {
        dispatch(openConversation(friend.email));
    };

    const getLastMessagePreview = () => {
        if (!lastMessage?.content) return 'No messages yet';
        const prefix = lastMessage.sender === currentUserEmail ? 'You: ' : '';
        const content = lastMessage.content.length > 30
            ? lastMessage.content.substring(0, 30) + '...'
            : lastMessage.content;
        return prefix + content;
    };

    return (
        <ListItem
            button
            onClick={handleClick}
            sx={{
                borderBottom: 1,
                borderColor: 'divider',
                '&:hover': {
                    backgroundColor: 'action.hover'
                }
            }}
        >
            <ListItemAvatar>
                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    sx={{
                        '& .MuiBadge-badge': {
                            backgroundColor: isOnline ? '#44b700' : '#bdbdbd',
                            color: isOnline ? '#44b700' : '#bdbdbd',
                            boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}`,
                            '&::after': {
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                animation: isOnline ? 'ripple 1.2s infinite ease-in-out' : 'none',
                                border: '1px solid currentColor',
                                content: '""',
                            },
                        },
                        '@keyframes ripple': {
                            '0%': {
                                transform: 'scale(.8)',
                                opacity: 1,
                            },
                            '100%': {
                                transform: 'scale(2.4)',
                                opacity: 0,
                            },
                        },
                    }}
                >
                    <Avatar src={friend?.picture} alt={friend?.name}>
                        {friend?.name?.charAt(0) || '?'}
                    </Avatar>
                </Badge>
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: unreadCount > 0 ? 700 : 400 }}
                        >
                            {friend?.name || 'Unknown'}
                        </Typography>
                        {lastMessage?.timestamp && (
                            <Typography variant="caption" color="text.secondary">
                                {moment(lastMessage.timestamp).fromNow()}
                            </Typography>
                        )}
                    </Box>
                }
                secondary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography
                            variant="body2"
                            color={unreadCount > 0 ? 'text.primary' : 'text.secondary'}
                            sx={{
                                fontWeight: unreadCount > 0 ? 600 : 400,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: unreadCount > 0 ? '80%' : '100%'
                            }}
                        >
                            {getLastMessagePreview()}
                        </Typography>
                        {unreadCount > 0 && (
                            <Badge
                                badgeContent={unreadCount}
                                color="primary"
                                sx={{ ml: 1 }}
                            />
                        )}
                    </Box>
                }
            />
        </ListItem>
    );
}
