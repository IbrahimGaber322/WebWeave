import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/posts.js"; 
import http from 'http';
import rateLimit from 'express-rate-limit'
import { Server } from 'socket.io';
const app = express();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  });
  
const server = http.Server(app);
const FRONTEND_URL = process.env.FRONTEND_URL;
const io = new Server(server,{
    cors: {
      origin: FRONTEND_URL
    }
  });
  


io.on('connection', (socket) => {
   
    socket.on('signUser', (data) => {
        socket.join(data);
        console.log(data);
      });
   

    
  });

const SOCKET_PORT = process.env.SOCKET_PORT;

io.listen(SOCKET_PORT, () => {
    console.log(`Server listening on port ${SOCKET_PORT}`);
  });

app.use(limiter);
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());

app.use('/posts', postRoutes);
app.use('/user', userRoutes);
const SERVER_PORT = process.env.SERVER_PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL;

mongoose.connect(DATABASE_URL, {useNewUrlParser: true}).then(()=> app.listen(SERVER_PORT, ()=>console.log(`Server running on port: ${SERVER_PORT}`))).catch(((err)=>console.log(err)));


export {io};



