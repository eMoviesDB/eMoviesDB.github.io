import { getMovieById } from '../api/data.js';

export function loadMovie(ctx, next) {
    ctx.moviePromise = getMovieById(ctx.params.id);
    next();
}
