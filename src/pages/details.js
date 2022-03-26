import { deleteMovieById } from '../api/data.js';
import { createLike, getMovieLikes } from '../api/likes.js';
import { html, until } from '../lib.js';
import { getUserData } from '../util.js';

const movieDetailsTemplate = (
    movie,
    onDelete,
    isOwner,
    isAuthenticated,
    onLike
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
                    ${isAuthenticated
                        ? html`<a
                              class="btn btn-primary"
                              href="javascript:void(0)"
                              @click=${onLike}
                              >Like</a
                          >`
                        : null}
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

        movie.likes = likes.results.length;
        const user = getUserData();
        const isAuthenticated = user && user.objectId != movie.owner.objectId;
        const isOwner = user.objectId == movie.owner.objectId;
        return movieDetailsTemplate(
            movie,
            onDelete.bind(null, movie.title),
            isOwner,
            isAuthenticated,
            onLike
        );
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
