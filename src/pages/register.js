import { register } from '../api/users.js';
import { html } from '../lib.js';

const registerTemplate = (onSubmit, errorMsg) => html`
    <section id="form-sign-up">
        ${errorMsg
            ? html`<div id="error-container" class="text-center">
                  <span>${errorMsg}</span>
              </div>`
            : null}
        <form
            class="text-center border border-light p-5"
            action="#"
            method="post"
            @submit=${onSubmit}
        >
            <div class="form-group">
                <label for="username">Username</label>
                <input
                    id="username"
                    type="text"
                    class="form-control"
                    placeholder="Username"
                    name="username"
                    value=""
                />
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input
                    id="email"
                    type="email"
                    class="form-control"
                    placeholder="Email"
                    name="email"
                    value=""
                />
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input
                    id="password"
                    type="password"
                    class="form-control"
                    placeholder="Password"
                    name="password"
                    value=""
                />
            </div>

            <div class="form-group">
                <label for="repeatPassword">Repeat Password</label>
                <input
                    id="repeatPassword"
                    type="password"
                    class="form-control"
                    placeholder="Repeat-Password"
                    name="repeatPassword"
                    value=""
                />
            </div>

            <button type="submit" class="btn btn-primary">Register</button>
        </form>
    </section>
`;

export function registerPage(ctx) {
    update();

    function update(errorMsg) {
        ctx.render(registerTemplate(onSubmit, errorMsg));
    }

    async function onSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        const username = formData.get('username').trim();
        const email = formData.get('email').trim();
        const password = formData.get('password').trim();
        const repeatPassword = formData.get('repeatPassword').trim();

        if (
            username == '' ||
            email == '' ||
            password == '' ||
            repeatPassword == ''
        ) {
            update('All fields are required!');
            return;
        }

        if (password !== repeatPassword) {
            update("Password's does not match!");
            return;
        }

        try {
            const usernameToLowerCase = username.toLocaleLowerCase();
            await register(email, usernameToLowerCase, password);
            event.target.reset();
            ctx.page.redirect('/login');
        } catch (error) {
            update(error);
        }
    }
}
