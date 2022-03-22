import { render } from '../lib.js';
import { navigation } from '../pages/navigation.js';

const main = document.querySelector('main');

export function decorateContext(context, next) {
    context.render = (content) => render([navigation(context), content], main);
    next();
}
