import { post } from './request.js';

const endpoints = {
    LOGIN: '/login',
    REGISTER: '/users',
    LOGOUT: '/logout',
};

export async function login(username, password) {
    return await post(endpoints.LOGIN, { username, password });
}

export async function register(email, username, password, gender) {
    return await post(endpoints.REGISTER, {
        email,
        username,
        password,
        gender,
    });
}

export async function logout() {
    return await post(endpoints.LOGOUT);
}
