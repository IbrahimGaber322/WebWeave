import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    List,
    Typography,
    CircularProgress,
    TextField,
    InputAdornment,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ConversationItem from './ConversationItem';
import { openConversation } from '../../actions/chat';

export default function ConversationList({ conversations }) {
    const dispatch = useDispatch();
    const { isLoading, onlineUsers } = useSelector(state => state.chat);
    const user = useSelector(state => state.user);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter friends based on search
    const filteredFriends = user?.friends?.filter(friend =>
        friend.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.email?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    // Get friends who don't have an existing conversation
    const friendsWithoutConversation = filteredFriends.filter(friend => {
        return !conversations?.some(conv =>
            conv.participants?.includes(friend.email)
        );
    });

    const handleStartChat = (friendEmail) => {
        dispatch(openConversation(friendEmail));
        setSearchQuery('');
    };

    if (isLoading && !conversations?.length) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <CircularProgress />
            </Box>
        );
    }

    const hasNoFriends = !user?.friends || user.friends.length === 0;

    return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Search Box */}
            <Box sx={{ p: 2, pb: 1 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search friends..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        )
                    }}
                />
            </Box>

            <Box sx={{ flex: 1, overflow: 'auto' }}>
                {hasNoFriends ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1, p: 3, height: '100%' }}>
                        <PersonAddIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="body1" color="text.secondary" textAlign="center">
                            No friends yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
                            Add friends to start chatting
                        </Typography>
                    </Box>
                ) : (
                    <>
                        {/* Show friends without conversation when searching */}
                        {searchQuery && friendsWithoutConversation.length > 0 && (
                            <>
                                <Typography variant="caption" color="text.secondary" sx={{ px: 2, py: 1, display: 'block' }}>
                                    Start a new conversation
                                </Typography>
                                <List sx={{ p: 0 }}>
                                    {friendsWithoutConversation.map(friend => (
                                        <ListItem
                                            key={friend.email}
                                            button
                                            onClick={() => handleStartChat(friend.email)}
                                            sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                                        >
                                            <ListItemAvatar>
                                                <Box sx={{ position: 'relative' }}>
                                                    <Avatar src={friend.picture} alt={friend.name}>
                                                        {friend.name?.charAt(0)}
                                                    </Avatar>
                                                    {onlineUsers[friend.email] && (
                                                        <Box
                                                            sx={{
                                                                position: 'absolute',
                                                                bottom: 2,
                                                                right: 2,
                                                                width: 10,
                                                                height: 10,
                                                                backgroundColor: 'success.main',
                                                                borderRadius: '50%',
                                                                border: '2px solid',
                                                                borderColor: 'background.paper'
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={friend.name}
                                                secondary={onlineUsers[friend.email] ? 'Online' : 'Offline'}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                                {conversations?.length > 0 && <Divider />}
                            </>
                        )}

                        {/* Existing conversations */}
                        {conversations && conversations.length > 0 ? (
                            <>
                                {searchQuery && friendsWithoutConversation.length > 0 && (
                                    <Typography variant="caption" color="text.secondary" sx={{ px: 2, py: 1, display: 'block' }}>
                                        Recent conversations
                                    </Typography>
                                )}
                                <List sx={{ p: 0 }}>
                                    {conversations
                                        .filter(conv => {
                                            if (!searchQuery) return true;
                                            const otherEmail = conv.participants?.find(p => p !== user?.email);
                                            const friend = user?.friends?.find(f => f.email === otherEmail);
                                            return friend?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                otherEmail?.toLowerCase().includes(searchQuery.toLowerCase());
                                        })
                                        .map(conversation => (
                                            <ConversationItem
                                                key={conversation._id}
                                                conversation={conversation}
                                                currentUserEmail={user?.email}
                                            />
                                        ))}
                                </List>
                            </>
                        ) : !searchQuery ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 3 }}>
                                <Typography variant="body1" color="text.secondary" textAlign="center">
                                    No conversations yet
                                </Typography>
                                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
                                    Search for a friend above to start chatting
                                </Typography>
                            </Box>
                        ) : null}

                        {/* No results message */}
                        {searchQuery && friendsWithoutConversation.length === 0 &&
                         conversations?.filter(conv => {
                            const otherEmail = conv.participants?.find(p => p !== user?.email);
                            const friend = user?.friends?.find(f => f.email === otherEmail);
                            return friend?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                otherEmail?.toLowerCase().includes(searchQuery.toLowerCase());
                         }).length === 0 && (
                            <Box sx={{ p: 3, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    No friends found matching "{searchQuery}"
                                </Typography>
                            </Box>
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
}
