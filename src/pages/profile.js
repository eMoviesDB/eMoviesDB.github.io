import { getAllMovies } from '../api/data.js';
import { html } from '../lib.js';
import { getUserData } from '../util.js';

const movieCardTemplate = (movie) => html`
    <div class="card mb-4">
        <img
            class="card-img-top"
            src="${movie.imageUrl}"
            alt="Wonder Woman"
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

const profileTemplate = (movies, userData) => html`
    <section id="user-profile-page" class="user-profile">
        <article class="user-info">
            <img
                id="user-avatar-url"
                alt="user-profile"
                src="/images/male.png"
            />
            <div class="user-content">
                <p>Username: ${userData.username}</p>
                <p>Email: ${userData.email}</p>
                <p>My movies count: ${movies.length}</p>
            </div>
        </article>
        <h1 id="user-listings-title">User Memes</h1>
        <section id="movie">
            <div class="mt-3">
                <div class="row d-flex d-wrap">
                    <div class="card-deck d-flex justify-content-center">
                        ${movies.length == 0
                            ? html`<h3 class="text-center">No movies yet.</h3>`
                            : movies.map(movieCardTemplate)}
                    </div>
                </div>
            </div>
        </section>
    </section>
`;

export async function profilePage(ctx) {
    let movies = await getAllMovies();
    const user = getUserData();
    movies = movies.results.filter((m) => m.ownerId == user.objectId);

    ctx.render(profileTemplate(movies, user));
}
