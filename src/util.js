import { html } from './lib.js';

export function setUserData(data) {
    sessionStorage.setItem('user', JSON.stringify(data));
}

export function getUserData() {
    const user = sessionStorage.getItem('user');

    if (user) {
        const userData = JSON.parse(user);
        userData.username = userData.username.toLocaleUpperCase();
        return userData;
    } else {
        return false;
    }
}

export function clearUserData() {
    sessionStorage.removeItem('user');
}

export const spinner = () => html`
    <div class="loader-wrapper text-center">
        <div class="loader">
            <div class="loader loader-inner"></div>
        </div>
    </div>
`;
