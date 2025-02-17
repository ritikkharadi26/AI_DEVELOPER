
import socket from 'socket.io-client';

let socketInstance = null;

export const connectSocket = (projectId) => {
    socketInstance = socket(import.meta.env.VITE_API_URL, {
        auth: {
            token: localStorage.getItem('token')
        },
        query: {
            projectId
        }
    });

    


    // Add event listeners for connection and error events
    socketInstance.on('connect', () => {
        console.log('Socket connected:', socketInstance.id);
    });

    socketInstance.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
    });

    socketInstance.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
    });

    console.log("socketInstance", socketInstance);
    return socketInstance;
};

export const getMessage = (eventName, cb) => {
    socketInstance.on(eventName, cb);
   
    console.log("message received");

};

export const sendMessage = (eventName, data) => {
    socketInstance.emit(eventName, data);
    
    console.log("message sent");
};