import { get, post, put, del } from './request.js';

const endpoints = {
    ALL_MOVIES: '/classes/Movies',
    MOVIE_BY_ID: (id) => `/classes/Movies/${id}`,
    CREATE_MOVIE: '/classes/Movies',
    DELETE_MOVIE: (id) => `/classes/Movies/${id}`,
    EDIT_MOVIE: (id) => `/classes/Movies/${id}`,
    SEARCH: (searchedProp) =>
        `/classes/Movies?where=${searchQuery('title', searchedProp)}`,
    MY_PROFILE: (userId) =>
        `/classes/Movies?where=${searchQuery('ownerId', userId)}`,
    DELETE_LIKE: `/classes/Likes/`,
    GET_MOVIES: (limit, skip) => `/classes/Movies?limit=${limit}&skip=${skip}`,
};

export async function getMyMovies(userId) {
    return await get(endpoints.MY_PROFILE(userId));
}

export async function searchMovie(query) {
    return await get(endpoints.SEARCH(query));
}

export async function getAllMovies() {
    return await get(endpoints.ALL_MOVIES);
}

export async function getMovieById(id) {
    return await get(endpoints.MOVIE_BY_ID(id));
}

export async function createMovie(data) {
    return await post(endpoints.CREATE_MOVIE, data);
}

export async function deleteMovieById(id) {
    return await del(endpoints.DELETE_MOVIE(id));
}

export async function editMovie(id, data) {
    return await put(endpoints.EDIT_MOVIE(id), data);
}

export async function deleteLike(likeId) {
    return del(endpoints.DELETE_LIKE + likeId);
}

export function searchQuery(propName, searchedValue) {
    return createQuery({ [propName]: searchedValue });
}

export function createQuery(query) {
    return encodeURIComponent(JSON.stringify(query));
}

export async function getMovies(limit, skip) {
    return get(endpoints.GET_MOVIES(limit, skip));
}
