import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import moment from 'moment';

export default function MessageBubble({ message, isOwn, showAvatar }) {
    const formattedTime = moment(message.createdAt).format('h:mm A');
    const fullTime = moment(message.createdAt).format('MMMM D, YYYY [at] h:mm A');

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isOwn ? 'flex-end' : 'flex-start',
                mb: showAvatar ? 1 : 0.5
            }}
        >
            <Tooltip title={fullTime} placement={isOwn ? 'left' : 'right'}>
                <Box
                    sx={{
                        maxWidth: '75%',
                        backgroundColor: isOwn ? 'primary.main' : 'grey.200',
                        color: isOwn ? 'primary.contrastText' : 'text.primary',
                        borderRadius: 2,
                        borderTopRightRadius: isOwn ? 0 : 16,
                        borderTopLeftRadius: isOwn ? 16 : 0,
                        px: 2,
                        py: 1,
                        wordBreak: 'break-word'
                    }}
                >
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {message.content}
                    </Typography>
                </Box>
            </Tooltip>
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 0.5, px: 1 }}
            >
                {formattedTime}
            </Typography>
        </Box>
    );
}
