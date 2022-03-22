import { page } from './lib.js';
import { decorateContext } from './middlewares/render.js';
import { catalogPage } from './pages/catalog.js';

import * as api from './api/request.js';
import { loginPage } from './pages/login.js';
import { registerPage } from './pages/register.js';
import { createPage } from './pages/create.js';
import { detailsPage } from './pages/details.js';
import { loadMovie } from './middlewares/loadMovie.js';
window.api = api;

page(decorateContext);
page('/', catalogPage);
page('/login', loginPage);
page('/register', registerPage);
page('/create', createPage);
page('/details/:id', loadMovie, detailsPage);

page.redirect('/index.html', '/');

page.start();
