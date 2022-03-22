import { createMovie } from '../api/data.js';
import { html } from '../lib.js';
import { getUserData } from '../util.js';

const createTemplate = (onSubmit, errorMsg) => html`
    <section id="add-movie">
        ${errorMsg
            ? html`<div id="error-container" class="text-center">
                  <span>${errorMsg}</span>
              </div>`
            : null}
        <form
            class="text-center border border-light p-5"
            action="#"
            method=""
            @submit=${onSubmit}
        >
            <h1>Add Movie</h1>
            <div class="form-group">
                <label for="title">Movie Title</label>
                <input
                    id="title"
                    type="text"
                    class="form-control"
                    placeholder="Title"
                    name="title"
                    value=""
                />
            </div>
            <div class="form-group">
                <label for="description">Movie Description</label>
                <textarea
                    class="form-control"
                    placeholder="Description"
                    name="description"
                ></textarea>
            </div>
            <div class="form-group">
                <label for="imageUrl">Image url</label>
                <input
                    id="imageUrl"
                    type="text"
                    class="form-control"
                    placeholder="Image Url"
                    name="imageUrl"
                    value=""
                />
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </section>
`;

export function createPage(ctx) {
    update();

    function update(errorMsg) {
        ctx.render(createTemplate(onSubmit, errorMsg));
    }

    async function onSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const title = formData.get('title').trim();
        const description = formData.get('description').trim();
        const imageUrl = formData.get('imageUrl').trim();

        if (title == '' || description == '' || imageUrl == '') {
            update('All fields are required!');
            return;
        }

        try {
            const ownerId = getUserData().objectId;

            const createdMovie = await createMovie({
                title,
                description,
                imageUrl,
                ownerId,
            });
            event.target.reset();
            ctx.page.redirect('/details/' + createdMovie.objectId);
        } catch (error) {
            update(error);
        }
    }
}
