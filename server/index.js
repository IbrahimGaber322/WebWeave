import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';
import { Server } from 'socket.io';

import logger from './utils/logger.js';
import morganMiddleware from './middleware/requestLogger.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';

const app = express();
const server = http.createServer(app);

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const allowedOrigins = CLIENT_URL.split(',').map(url => url.trim());

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true
    }
});

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests, please try again later'
    }
});

const SERVER_PORT = process.env.PORT || process.env.SERVER_PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL || process.env.CONNECTION_URL;

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(limiter);
app.use(morganMiddleware);
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

// Routes
import userRoutes from './routes/user.js';
import postRoutes from './routes/posts.js';
app.use('/posts', postRoutes);
app.use('/user', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Server is running' });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Socket.IO
io.on('connection', (socket) => {
    logger.info('New socket connection', { socketId: socket.id });

    socket.on('signUser', (data) => {
        socket.join(data);
        logger.debug('User joined room', { room: data, socketId: socket.id });
    });

    socket.on('disconnect', () => {
        logger.debug('Socket disconnected', { socketId: socket.id });
    });
});

// Start the server
mongoose.connect(DATABASE_URL)
    .then(() => {
        logger.info('Connected to MongoDB');
        server.listen(SERVER_PORT, () => {
            logger.info(`Server listening on port ${SERVER_PORT}`);
        });
    })
    .catch((err) => {
        logger.error('Failed to connect to MongoDB', { error: err.message });
        process.exit(1);
    });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Promise Rejection', { error: err.message, stack: err.stack });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception', { error: err.message, stack: err.stack });
    process.exit(1);
});

export { io };
