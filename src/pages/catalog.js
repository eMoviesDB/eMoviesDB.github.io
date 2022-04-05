import { getAllMovies, getCount, getMovies, searchMovie } from '../api/data.js';
import { html, until, nothing } from '../lib.js';
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

const catalogTemplate = (
    moviesPromise,
    isAuthenticated,
    onSearch,
    page,
    pages
) => html`
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
            <h1 class="display-4">eMovies</h1>
            <p class="lead">
                Unlimited movies, TV shows, and more. Watch anywhere. Cancel
                anytime.
            </p>
        </div>
    </section>

    <h1 class="text-center">Movies</h1>
    <form
        class="form-inline my-2 my-lg-0 justify-content-center"
        @submit=${onSearch}
    >
        <input
            class="form-control mr-sm-2"
            type="search"
            name="search"
            placeholder="Search"
            aria-label="Search"
        />
        <button class="btn btn-outline-success my-2 my-sm-0" type="submit">
            Search
        </button>
    </form>

    ${isAuthenticated
        ? html`<section id="add-movie-button">
              <a href="/create" class="btn btn-warning">Add Movie</a>
          </section>`
        : nothing}

    <section id="movie">
        <div class="mt-3">
            <div class="row d-flex d-wrap">
                <div class="card-deck d-flex justify-content-center">
                    ${until(moviesPromise, html`<h2>Loading &hellip;</h2>`)}
                </div>
            </div>
            <nav
                aria-label="Page navigation example"
                class="navbar-nav mx-auto"
            >
                <ul class="pagination" style="justify-content: center;">
                    <p class="page-link">Pages: ${page} of ${pages}</p>
                    ${page > 1
                        ? html`<li class="page-item">
                              <a
                                  class="page-link"
                                  href="/?page=${Math.max(page - 1, 1)}"
                                  aria-label="Previous"
                              >
                                  <span aria-hidden="true">&lt; Previous</span>
                                  <span class="sr-only">Previous</span>
                              </a>
                          </li>`
                        : nothing}
                    ${page < pages
                        ? html`<li class="page-item">
                              <a
                                  class="page-link"
                                  href="/?page=${page + 1}"
                                  aria-label="Next"
                              >
                                  <span aria-hidden="true">Next &gt;</span>
                                  <span class="sr-only">Next</span>
                              </a>
                          </li>`
                        : nothing}
                </ul>
            </nav>
        </div>
    </section>
`;

export function catalogPage(ctx) {
    const querystring = Object.fromEntries([
        ...new URLSearchParams(ctx.querystring).entries(),
    ]);

    if (querystring.hasOwnProperty('page')) {
        const page = Math.max(Number(querystring.page), 1);
        update(loadMovies(page), page);
    } else {
        update(loadMovies());
    }

    async function update(movies, page = 1) {
        const allMovies = await getCount();
        const pages = Math.ceil(allMovies.results.length / 4);
        ctx.render(
            catalogTemplate(movies, getUserData(), onSearch, page, pages)
        );
    }

    async function loadMovies(skip = 1) {
        const movies = await getMovies(skip);

        if (movies.results.length > 0) {
            return movies.results.map(movieTemplate);
        } else {
            return html`<p>No Movies added yet.</p>`;
        }
    }

    async function onSearch(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const search = formData.get('search').trim();

        if (search != '') {
            const searchedMovies = await searchMovie(search);

            if (searchedMovies.results.length > 0) {
                update(searchedMovies.results.map(movieTemplate));
            } else {
                update(html`<h2>No search results!</h2>`);
            }
        } else {
            update(loadMovies());
        }
    }
}
