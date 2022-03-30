import { deleteLike, deleteMovieById } from '../api/data.js';
import { createLike, getMovieLikes } from '../api/likes.js';
import { html, until, nothing } from '../lib.js';
import { getUserData } from '../util.js';

const movieDetailsTemplate = (
    movie,
    onDelete,
    isOwner,
    isAuthenticated,
    onLike,
    isLiked,
    onUnlike
) => html`
    <section id="movie-example">
        <div class="container">
            <div class="row bg-light text-dark">
                <h1>Movie title: ${movie.title}</h1>

                <div class="col-md-8">
                    <img
                        class="img-thumbnail"
                        src="${movie.imageUrl}"
                        alt="movie"
                    />
                </div>
                <div class="col-md-4 text-center">
                    <h3 class="my-3">Movie Description</h3>
                    <p>${movie.description}</p>
                    ${isOwner
                        ? html`<a
                                  class="btn btn-danger"
                                  href="javascript:void(0)"
                                  @click=${onDelete}
                                  >Delete</a
                              >
                              <a
                                  class="btn btn-warning"
                                  href="/edit/${movie.objectId}"
                                  >Edit</a
                              >`
                        : null}
                    ${isAuthenticated && !isLiked
                        ? html`<button class="btn btn-primary" @click=${onLike}>
                              Like
                          </button>`
                        : nothing}
                    ${isAuthenticated && isLiked
                        ? html`<button
                              class="btn btn-primary"
                              @click=${onUnlike}
                          >
                              Unlike
                          </button>`
                        : nothing}
                    <span class="enrolled-span">Liked ${movie.likes}</span>
                </div>
            </div>
        </div>
    </section>
`;

const detailsTemplate = (moviePromise) => html`
    ${until(moviePromise, html`<h2 class="text-center">Loading &hellip;</h2>`)}
`;

export function detailsPage(ctx) {
    ctx.render(detailsTemplate(loadMovie()));

    async function loadMovie() {
        const [movie, likes] = await Promise.all([
            ctx.moviePromise,
            getMovieLikes(ctx.params.id),
        ]);

        movie.likes = likes.results.length || 0;
        const user = getUserData();
        const isAuthenticated = user && user.objectId != movie.ownerId;
        const isOwner = user.objectId == movie.ownerId;
        const isLiked = likes.results.some((l) => l.userId == user.objectId);

        return movieDetailsTemplate(
            movie,
            onDelete.bind(null, movie.title),
            isOwner,
            isAuthenticated,
            onLike,
            isLiked,
            onUnlike.bind(null, likes)
        );
    }

    async function onUnlike(likes) {
        const user = getUserData();
        const likeObject = likes.results.find(
            (like) => like.userId == user.objectId
        );

        const result = await deleteLike(likeObject.objectId);
        ctx.render(detailsTemplate(loadMovie()));
    }

    async function onLike(event) {
        await createLike(getUserData().objectId, ctx.params.id);
        ctx.page.redirect('/details/' + ctx.params.id);
    }

    async function onDelete(title) {
        const confirmed = confirm(`Are you sure you want to delete ${title}?`);

        if (confirmed) {
            await deleteMovieById(ctx.params.id);
            ctx.page.redirect('/');
        }
    }
}
