import { deleteMovieById } from '../api/data.js';
import { html, until } from '../lib.js';
import { getUserData } from '../util.js';

const movieDetailsTemplate = (movie, onDelete, isOwner) => html`
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
                    <a class="btn btn-primary" href="#">Like</a>
                    <span class="enrolled-span">Liked 1</span>
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
        const movie = await ctx.moviePromise;
        const isOwner = getUserData().objectId == movie.ownerId;
        return movieDetailsTemplate(movie, onDelete, isOwner);
    }

    async function onDelete(event) {
        const confirmed = confirm(
            'Are you sure you want to delete this movie?'
        );

        if (confirmed) {
            await deleteMovieById(ctx.params.id);
            ctx.page.redirect('/');
        }
    }
}
