import { io, Socket } from 'socket.io-client';
import { Message, User } from './App';

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

    subscribe(
        initMessagesHandler: (messages: Message[]) => void,
        newMessageSentHandler: (message: Message) => void,
        userTypingHandler: (user: User) => void,
        userStopTypingHandler: (user: User) => void
    ) {
        if (this.socket) {
            this.socket.on('init-messages-published', initMessagesHandler);
            this.socket.on('new-message-sent', newMessageSentHandler);
            this.socket.on('user-typing', userTypingHandler);
            this.socket.on('user-stop-typing', userStopTypingHandler);
        }
    },

    sendName(name: string) {
        this.socket?.emit('client-name-sent', name);
    },

    sendMessage(message: string) {
        this.socket?.emit('client-message-sent', message);
    },

    userTyping() {
        this.socket?.emit('user-typed');
    },

    userStopTyping() {
        this.socket?.emit('user-stop-typed');
    },
};
