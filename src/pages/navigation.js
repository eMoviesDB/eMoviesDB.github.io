import { html } from '../lib.js';
import { clearUserData, getUserData } from '../util.js';

const navigationTemplate = (userData, onLogout) => html`
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <a class="navbar-brand text-light" href="/">eMovies</a>
        <ul class="navbar-nav ml-auto">
            ${userData
                ? html`<li class="nav-item">
                          <a class="nav-link">Welcome, ${userData.username}</a>
                      </li>
                      <li class="nav-item">
                          <a
                              class="nav-link"
                              href="javascript:void(0)"
                              @click=${onLogout}
                              >Logout</a
                          >
                      </li>`
                : html`<li class="nav-item">
                          <a class="nav-link" href="/login">Login</a>
                      </li>
                      <li class="nav-item">
                          <a class="nav-link" href="/register">Register</a>
                      </li>`}
        </ul>
    </nav>
`;

export function navigation(ctx) {
    return navigationTemplate(getUserData(), onLogout);

    function onLogout() {
        clearUserData();
        ctx.page.redirect('/');
    }
}
