import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import projectModel from './models/project.js';
import jwt from 'jsonwebtoken';
import { generateResult } from './services/ai.js';
const port = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*'
    }
});


// Socket middleware for authentication
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token || socket.handshake.authorization?.split(' ')[1];
        const projectId = socket.handshake.query.projectId;
        if (!token) {
            return next(new Error('Authentication error'));
        }
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error('Invalid project id'));
        }
        const project = await projectModel.findById(projectId);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!project || !decoded) {
            return next(new Error('Authentication error'));
        }
        socket.user = decoded;
        socket.project = project;
        next();
    } catch (error) {
        next(error);
    }
});

io.on('connection', socket => {
    console.log('user connected');
    console.log("socket.project._id", socket.project._id);
    if (socket.project && socket.project._id) {
        socket.roomId = socket.project._id.toString();
        console.log("socket.roomId", socket.roomId);
        socket.join(socket.roomId);
    } else {
        console.error('socket.project is undefined or does not have an _id property');
    }

    // Event to broadcast message in room using socket.broadcast.to.emit method
    socket.on('project-message', async data => {
        const message = data.message;
        const sender = data.sender;
        console.log('message', message);
        console.log('sender', sender);
        socket.broadcast.to(socket.roomId).emit('project-message', { message,
            sender});

      //  implement AI response 
        const aiIsPresentInMessage = message.includes('@ai');
        if (aiIsPresentInMessage) {
            const prompt = message.replace('@ai', '');
            const result = await generateResult(prompt);
            console.log('AI result', result);
            io.to(socket.roomId).emit('project-message', {
                message: result,
                sender: {
                    _id: 'ai',
                    email: 'AI'
                }
            });
            return;
        }
    });

    // Disconnecting socket
    socket.on('disconnect', () => {
        socket.leave(socket.roomId);
        console.log('user disconnected');
    });
});

server.listen(port, () => {
    console.log(`server is running at port ${port}`);
});