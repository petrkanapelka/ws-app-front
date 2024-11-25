import { socketApi } from './api';
import { Message } from './App';
import { Dispatch } from 'redux';

const initialState = {
    messages: [] as Message[],
};

type ChatState = typeof initialState;

export const chatReducer = (state: ChatState = initialState, action: Actions): ChatState => {
    switch (action.type) {
        case 'messages-received': {
            return { ...state, messages: action.messages };
        }
        case 'new-message-received': {
            return { ...state, messages: [...state.messages, action.message] };
        }
        default:
            return state;
    }
};

type Actions = ReturnType<typeof messagesReceived> | ReturnType<typeof newMessageReceived>;

export const messagesReceived = (messages: Message[]) => ({ type: 'messages-received', messages } as const);

export const newMessageReceived = (message: Message) => ({ type: 'new-message-received', message } as const);

export const createConnection = () => (dispatch: Dispatch) => {
    socketApi.createConnection();
    socketApi.subscribe(
        (messages) => {
            dispatch(messagesReceived(messages));
        },
        (message) => {
            dispatch(newMessageReceived(message));
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
