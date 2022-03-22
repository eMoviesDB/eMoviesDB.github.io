import { getAllMovies } from '../api/data.js';
import { html, until } from '../lib.js';
import { getUserData } from '../util.js';

const movieTemplate = (movie) => html`
    <div class="card mb-4">
        <img
            class="card-img-top"
            src="${movie.imageUrl}"
            alt="${movie.title}"
            width="400"
        />
        <div class="card-body">
            <h4 class="card-title">${movie.title}</h4>
        </div>
        <div class="card-footer">
            <a href="/details/${movie.objectId}">
                <button type="button" class="btn btn-info">Details</button>
            </a>
        </div>
    </div>
`;

const catalogTemplate = (moviesPromise, isAuthenticated) => html`
    <section id="home-page">
        <div
            class="jumbotron jumbotron-fluid text-light"
            style="background-color: #343a40"
        >
            <img
                src="https://slicksmovieblog.files.wordpress.com/2014/08/cropped-movie-banner-e1408372575210.jpg"
                class="img-fluid"
                alt="Responsive image"
                style="width: 150%; height: 200px"
            />
            <h1 class="display-4">Movies</h1>
            <p class="lead">
                Unlimited movies, TV shows, and more. Watch anywhere. Cancel
                anytime.
            </p>
        </div>
    </section>

    <h1 class="text-center">Movies</h1>

    ${isAuthenticated
        ? html`<section id="add-movie-button">
              <a href="/create" class="btn btn-warning">Add Movie</a>
          </section>`
        : null}

    <section id="movie">
        <div class="mt-3">
            <div class="row d-flex d-wrap">
                <div class="card-deck d-flex justify-content-center">
                    ${until(moviesPromise, html`<h2>Loading &hellip;</h2>`)}
                </div>
            </div>
        </div>
    </section>
`;

export function catalogPage(ctx) {
    ctx.render(catalogTemplate(loadMovies(), getUserData()));

    async function loadMovies() {
        const movies = await getAllMovies();

        if (movies.results.length > 0) {
            return movies.results.map(movieTemplate);
        } else {
            return html`<p>No Movies added yet.</p>`;
        }
    }
}
