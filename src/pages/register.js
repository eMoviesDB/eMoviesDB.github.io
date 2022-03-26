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

            <div class="form-group">Please select gender:</div>
            <div class="form-check">
                <input
                    class="form-check-input"
                    type="radio"
                    name="gender"
                    id="flexRadioDefault1"
                    value="male"
                    checked
                />
                <label class="form-check-label" for="flexRadioDefault1">
                    Male
                </label>
            </div>
            <div class="form-check mb-4">
                <input
                    class="form-check-input"
                    type="radio"
                    name="gender"
                    id="flexRadioDefault2"
                    value="female"
                />
                <label class="form-check-label" for="flexRadioDefault2">
                    Female
                </label>
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
        const gender = formData.get('gender');

        try {
            if (
                username == '' ||
                email == '' ||
                password == '' ||
                repeatPassword == ''
            ) {
                throw new Error('All fields are required!');
            }

            if (password !== repeatPassword) {
                throw new Error("Password's does not match!");
            }

            const usernameToLowerCase = username.toLocaleLowerCase();
            await register(email, usernameToLowerCase, password, gender);
            event.target.reset();
            ctx.page.redirect('/login');
        } catch (error) {
            update(error.message);
        }
    }
}
