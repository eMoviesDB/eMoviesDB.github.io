import { post } from './request.js';

const endpoints = {
    LOGIN: '/login',
    REGISTER: '/users',
};

export async function login(username, password) {
    return await post(endpoints.LOGIN, { username, password });
}

export async function register(email, username, password) {
    return await post(endpoints.REGISTER, { email, username, password });
}
