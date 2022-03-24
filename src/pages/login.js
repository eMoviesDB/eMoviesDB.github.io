import { login } from '../api/users.js';
import { html } from '../lib.js';
import { setUserData } from '../util.js';

const loginTemplate = (onSubmit, errorMsg) => html`
    <section id="form-login">
        ${errorMsg
            ? html`<div id="error-container" class="text-center">
                  <span>${errorMsg}</span>
              </div>`
            : null}
        <form
            class="text-center border border-light p-5"
            action=""
            method=""
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

            <button type="submit" class="btn btn-primary">Login</button>
        </form>
    </section>
`;

export function loginPage(ctx) {
    update();

    function update(errorMsg) {
        ctx.render(loginTemplate(onSubmit, errorMsg));
    }

    async function onSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const username = formData.get('username').trim();
        const password = formData.get('password').trim();

        try {
            if (username == '' || password == '') {
                throw new Error('All fields are required!');
            }

            const usernameToLowerCase = username.toLocaleLowerCase();
            const user = await login(usernameToLowerCase, password);
            setUserData(user);
            event.target.reset();
            ctx.page.redirect('/');
        } catch (error) {
            update(error.message);
        }
    }
}
