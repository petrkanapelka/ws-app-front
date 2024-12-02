import axios from 'axios';
import { SOCKET_URL } from './api';

export const instance = axios.create({
    baseURL: SOCKET_URL,
});

export const axiosApi = {
    registerUser(authData: { email: string; password: string, name: string}) {
        return instance.post('/register', authData);
    },
    loginUser(authData: { email: string; password: string }) {
        return instance.post('/login', authData);
    },
};
