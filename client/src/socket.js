import { io } from 'socket.io-client';

const SERVER_URL = process.env.REACT_APP_SERVER_URL?.replace(/\/$/, '') || 'http://localhost:5000';

export const socket = io(SERVER_URL, {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
});

// Debug logging
socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
});

socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
});

socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
});

