import { socketApi } from './api';
import { Message, User } from './App';
import { Dispatch } from 'redux';

const initialState = {
    messages: [] as Message[],
    typingUsers: [] as User[],
};

type ChatState = typeof initialState;

export const chatReducer = (state: ChatState = initialState, action: Actions): ChatState => {
    switch (action.type) {
        case 'messages-received': {
            return { ...state, messages: action.messages };
        }
        case 'new-message-received': {
            return {
                ...state,
                messages: [...state.messages, action.message],
                typingUsers: state.typingUsers.filter((u) => u.id !== action.message.user.id),
            };
        }
        case 'user-message-typing': {
            return {
                ...state,
                typingUsers: [...state.typingUsers.filter((u) => u.id !== action.user.id), action.user],
            };
        }
        case 'user-message-stop-typing': {
            return {
                ...state,
                typingUsers: state.typingUsers.filter((u) => u.id !== action.user.id),
            };
        }
        default:
            return state;
    }
};

type Actions =
    | ReturnType<typeof messagesReceived>
    | ReturnType<typeof newMessageReceived>
    | ReturnType<typeof typingUserAdded>
    | ReturnType<typeof typingUserDeleted>;

export const messagesReceived = (messages: Message[]) => ({ type: 'messages-received', messages } as const);

export const newMessageReceived = (message: Message) => ({ type: 'new-message-received', message } as const);

export const typingUserAdded = (user: User) => ({ type: 'user-message-typing', user } as const);

export const typingUserDeleted = (user: User) => ({ type: 'user-message-stop-typing', user } as const);

export const createConnection = () => (dispatch: Dispatch) => {
    socketApi.createConnection();
    socketApi.subscribe(
        (messages) => {
            dispatch(messagesReceived(messages));
        },
        (message) => {
            dispatch(newMessageReceived(message));
        },
        (user) => {
            dispatch(typingUserAdded(user));
        },
        (user) => {
            // dispatch(typingUserDeleted(user));
            setTimeout(() => {
                dispatch(typingUserDeleted(user));
            }, 5000);
        }
    );
};
export const destroyConnection = () => (dispatch: Dispatch) => {
    socketApi.destroyConnection();
};

export const sendClientName = (name: string) => (dispatch: Dispatch) => {
    socketApi.sendName(name);
};

export const sendMessage = (message: string) => (dispatch: Dispatch) => {
    socketApi.sendMessage(message);
};

export const userTyping = () => (dispatch: Dispatch) => {
    socketApi.userTyping();
};

export const userStopTyping = () => (dispatch: Dispatch) => {
    socketApi.userStopTyping();
};
