import * as api from './request.js';
import { searchQuery } from './data.js';

const endpoints = {
    ALL_LIKES: '/classes/Likes',
    LIKES_FOR_MOVIE: (movieId) =>
        `/classes/Likes?where=${searchQuery('movieId', movieId)}`,
    CREATE_LIKE: '/classes/Likes',
};

export async function getMovieLikes(movieId) {
    return api.get(endpoints.LIKES_FOR_MOVIE(movieId));
}

export async function createLike(userId, movieId) {
    return api.post(endpoints.CREATE_LIKE, { userId, movieId });
}
