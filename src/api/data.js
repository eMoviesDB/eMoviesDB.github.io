import { get, post, put, del } from './request.js';

const endpoints = {
    ALL_MOVIES: '/classes/Movies',
    MOVIE_BY_ID: (id) => `/classes/Movies/${id}`,
    CREATE_MOVIE: '/classes/Movies',
};

export async function getAllMovies() {
    return await get(endpoints.ALL_MOVIES);
}

export async function getMovieById(id) {
    return await get(endpoints.MOVIE_BY_ID(id));
}

export async function createMovie(data) {
    return await post(endpoints.CREATE_MOVIE, data);
}
