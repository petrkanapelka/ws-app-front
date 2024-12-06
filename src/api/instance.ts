import axios from 'axios';
import { SOCKET_URL } from './api';

const token = localStorage.getItem('token');

export const instance = axios.create({
    baseURL: SOCKET_URL,
    headers: {
        Authorization: token ? `Bearer ${token}` : '',
    },
    // withCredentials: true,
});

export const axiosApi = {
    registerUser(authData: { email: string; password: string; name: string }) {
        return instance.post('/register', authData);
    },
    loginUser(authData: { email: string; password: string }) {
        return instance.post('/login', authData);
    },
    authUser(authData: { token: string }) {
        return instance.post('/profile', authData);
    },
    logOut(authData: { token: string }) {
        return instance.post('/logout', authData);
    },
};
