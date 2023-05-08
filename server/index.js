import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import rateLimit from 'express-rate-limit';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const server = http.createServer(app);
const FRONTEND_URL = process.env.FRONTEND_URL;
const io = new Server(server,{
    cors: {
      origin: '*'
    }
  });

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});

const SERVER_PORT = process.env.SERVER_PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL;

app.use(cors());
app.use(limiter);
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

// Routes
import userRoutes from './routes/user.js';
import postRoutes from './routes/posts.js';
app.use('/posts', postRoutes);
app.use('/user', userRoutes);

// Socket.IO
io.on('connection', (socket) => {
  socket.on('signUser', (data) => {
    socket.join(data);
  });
});

// Start the server
mongoose.connect(DATABASE_URL, { useNewUrlParser: true })
  .then(() => {
    server.listen(SERVER_PORT, () => {
      console.log(`Server listening on port ${SERVER_PORT}`);
    });
  })
  .catch((err) => console.log(err));

export { io };
