import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import logger from '../utils/logger';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        logger.error('React Error Boundary caught an error:', error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '100vh',
                        backgroundColor: 'background.default',
                        padding: 2
                    }}
                >
                    <Paper
                        elevation={3}
                        sx={{
                            padding: 4,
                            maxWidth: 500,
                            textAlign: 'center'
                        }}
                    >
                        <ErrorOutlineIcon
                            sx={{
                                fontSize: 80,
                                color: 'error.main',
                                mb: 2
                            }}
                        />
                        <Typography variant="h4" gutterBottom>
                            Oops! Something went wrong
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            We're sorry, but something unexpected happened. Please try refreshing the page or go back to the home page.
                        </Typography>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <Paper
                                sx={{
                                    p: 2,
                                    mb: 3,
                                    backgroundColor: 'grey.100',
                                    textAlign: 'left',
                                    overflow: 'auto',
                                    maxHeight: 200
                                }}
                            >
                                <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </Typography>
                            </Paper>
                        )}
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.handleReload}
                            >
                                Refresh Page
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={this.handleGoHome}
                            >
                                Go Home
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
