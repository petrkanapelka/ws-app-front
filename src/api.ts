import { io, Socket } from 'socket.io-client';
import { Message } from './App';

export const SOCKET_URL = 'http://localhost:3010';

export const socketApi = {
    socket: null as Socket | null,
    createConnection() {
        this.socket = io(SOCKET_URL);
    },
    destroyConnection() {
        this.socket?.disconnect();
        this.socket = null;
    },

    subscribe(initMessagesHandler: (messages: Message[]) => void, newMessageSentHandler: (message: Message) => void) {
        if (this.socket) {
            this.socket.on('init-messages-published', initMessagesHandler);
            this.socket.on('new-message-sent', newMessageSentHandler);
        }
    },

    sendName(name: string) {
        this.socket?.emit('client-name-sent', name);
    },

    sendMessage(message: string) {
        this.socket?.emit('client-message-sent', message);
    },
};
