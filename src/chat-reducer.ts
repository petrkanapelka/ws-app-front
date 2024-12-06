import { socketApi } from './api/api';
import { Dispatch } from 'redux';
import { Message, User } from './types/types';
import { axiosApi } from './api/instance';

const initialState = {
    messages: [] as Message[],
    typingUsers: [] as User[],
    error: '' as string,
    isUserLogin: false,
    nickname: '' as string,
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
        case 'error-received': {
            console.error(action.error);
            return state;
        }

        case 'nickname-received': {
            return { ...state, nickname: action.nickname };
        }

        case 'set-user-login': {
            return { ...state, isUserLogin: action.isUserLogin };
        }

        default:
            return state;
    }
};

type Actions =
    | ReturnType<typeof messagesReceived>
    | ReturnType<typeof newMessageReceived>
    | ReturnType<typeof typingUserAdded>
    | ReturnType<typeof typingUserDeleted>
    | ReturnType<typeof setError>
    | ReturnType<typeof setNickName>
    | ReturnType<typeof setUserLogin>;

export const messagesReceived = (messages: Message[]) => ({ type: 'messages-received', messages } as const);

export const newMessageReceived = (message: Message) => ({ type: 'new-message-received', message } as const);

export const typingUserAdded = (user: User) => ({ type: 'user-message-typing', user } as const);

export const typingUserDeleted = (user: User) => ({ type: 'user-message-stop-typing', user } as const);

export const setError = (error: string) => ({ type: 'error-received', error } as const);

export const setNickName = (nickname: string) => ({ type: 'nickname-received', nickname } as const);

export const setUserLogin = (isUserLogin: boolean) => ({ type: 'set-user-login', isUserLogin } as const);

export const createConnection = () => (dispatch: Dispatch) => {
    socketApi.createConnection();
    const token = localStorage.getItem('token');
    if (token) socketApi.authenticate(token);
    socketApi.subscribe(
        (messages) => {
            dispatch(messagesReceived(messages));
        },
        (message) => {
            return dispatch(newMessageReceived(message));
        },
        (user) => {
            dispatch(typingUserAdded(user));
        },
        (user) => {
            dispatch(typingUserDeleted(user));
        },
        (error) => dispatch(setError(error))
    );
};

export const destroyConnection = () => (dispatch: Dispatch) => {
    socketApi.destroyConnection();
};

export const sendClientName = (name: string) => (dispatch: Dispatch) => {
    socketApi.sendName(name);
    dispatch(setNickName(name));
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

export const logout = () => async (dispatch: Dispatch) => {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            await axiosApi.logOut({ token });
        }
    } catch (error) {
        console.error('Logout failed:', error);
    }
};
