import { editMovie } from '../api/data.js';
import { html, until } from '../lib.js';
import { getUserData } from '../util.js';

const editFormTemplate = (movie, onSubmit) => html`
    <form
        class="text-center border border-light p-5"
        action="#"
        method=""
        @submit=${onSubmit}
    >
        <h1>Edit Movie</h1>
        <div class="form-group">
            <label for="title">Movie Title</label>
            <input
                id="title"
                type="text"
                class="form-control"
                placeholder="Movie Title"
                value="${movie.title}"
                name="title"
            />
        </div>
        <div class="form-group">
            <label for="description">Movie Description</label>
            <textarea
                class="form-control"
                placeholder="Movie Description..."
                name="description"
            >
${movie.description}</textarea
            >
        </div>
        <div class="form-group">
            <label for="imageUrl">Image url</label>
            <input
                id="imageUrl"
                type="text"
                class="form-control"
                placeholder="Image Url"
                value="${movie.imageUrl}"
                name="imageUrl"
            />
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
    </form>
`;

const editTemplate = (moviePromise, errorMsg) => html`
    <section id="edit-movie">
        ${errorMsg
            ? html`<div id="error-container" class="text-center">
                  <span>${errorMsg}</span>
              </div>`
            : null}
        ${until(
            moviePromise,
            html`<h2 class="text-center">Loading &hellip;</h2>`
        )}
    </section>
`;

export function editPage(ctx) {
    update(loadMovie());

    function update(movie, errorMsg) {
        ctx.render(editTemplate(movie, errorMsg));
    }

    async function loadMovie() {
        const movie = await ctx.moviePromise;
        return editFormTemplate(movie, onSubmit);
    }

    async function onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const title = formData.get('title').trim();
        const description = formData.get('description').trim();
        const imageUrl = formData.get('imageUrl').trim();

        try {
            if (title == '' || description == '' || imageUrl == '') {
                throw new Error('All fields are required!');
            }

            const { id } = ctx.params;
            const user = getUserData().objectId;

            await editMovie(id, {
                title,
                description,
                imageUrl,
                ownerId: user,
            });

            event.target.reset();
            ctx.page.redirect('/details/' + id);
        } catch (error) {
            update(
                editFormTemplate({ title, description, imageUrl }, onSubmit),
                error
            );
        }
    }
}
