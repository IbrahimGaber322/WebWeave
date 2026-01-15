import React from 'react';
import { Box, Typography } from '@mui/material';

export default function TypingIndicator() {
    return (
        <Box sx={{ px: 2, py: 1 }}>
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                }}
            >
                <Box
                    component="span"
                    sx={{
                        display: 'inline-flex',
                        gap: 0.3
                    }}
                >
                    <Box
                        component="span"
                        sx={{
                            width: 6,
                            height: 6,
                            backgroundColor: 'text.secondary',
                            borderRadius: '50%',
                            animation: 'bounce 1.4s infinite ease-in-out both',
                            animationDelay: '0s',
                            '@keyframes bounce': {
                                '0%, 80%, 100%': {
                                    transform: 'scale(0)'
                                },
                                '40%': {
                                    transform: 'scale(1)'
                                }
                            }
                        }}
                    />
                    <Box
                        component="span"
                        sx={{
                            width: 6,
                            height: 6,
                            backgroundColor: 'text.secondary',
                            borderRadius: '50%',
                            animation: 'bounce 1.4s infinite ease-in-out both',
                            animationDelay: '0.16s',
                            '@keyframes bounce': {
                                '0%, 80%, 100%': {
                                    transform: 'scale(0)'
                                },
                                '40%': {
                                    transform: 'scale(1)'
                                }
                            }
                        }}
                    />
                    <Box
                        component="span"
                        sx={{
                            width: 6,
                            height: 6,
                            backgroundColor: 'text.secondary',
                            borderRadius: '50%',
                            animation: 'bounce 1.4s infinite ease-in-out both',
                            animationDelay: '0.32s',
                            '@keyframes bounce': {
                                '0%, 80%, 100%': {
                                    transform: 'scale(0)'
                                },
                                '40%': {
                                    transform: 'scale(1)'
                                }
                            }
                        }}
                    />
                </Box>
                typing...
            </Typography>
        </Box>
    );
}
