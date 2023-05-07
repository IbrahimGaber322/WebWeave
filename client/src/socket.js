import { io } from 'socket.io-client';

const SERVER_URL = process.env.REACT_APP_SERVER_URL ;



export const socket = io(SERVER_URL);

