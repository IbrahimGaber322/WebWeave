import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { setSnackbarRef } from '../utils/notificationService';

const SnackbarContext = createContext(null);

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
};

export const SnackbarProvider = ({ children }) => {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
        duration: 4000
    });

    const showSnackbar = useCallback((message, severity = 'info', duration = 4000) => {
        setSnackbar({
            open: true,
            message,
            severity,
            duration
        });
    }, []);

    const showSuccess = useCallback((message, duration) => {
        showSnackbar(message, 'success', duration);
    }, [showSnackbar]);

    const showError = useCallback((message, duration) => {
        showSnackbar(message, 'error', duration);
    }, [showSnackbar]);

    const showWarning = useCallback((message, duration) => {
        showSnackbar(message, 'warning', duration);
    }, [showSnackbar]);

    const showInfo = useCallback((message, duration) => {
        showSnackbar(message, 'info', duration);
    }, [showSnackbar]);

    const hideSnackbar = useCallback(() => {
        setSnackbar(prev => ({ ...prev, open: false }));
    }, []);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        hideSnackbar();
    };

    const value = useMemo(() => ({
        showSnackbar,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        hideSnackbar
    }), [showSnackbar, showSuccess, showError, showWarning, showInfo, hideSnackbar]);

    useEffect(() => {
        setSnackbarRef(value);
    }, [value]);

    return (
        <SnackbarContext.Provider value={value}>
            {children}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={snackbar.duration}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleClose}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};

export default SnackbarContext;
