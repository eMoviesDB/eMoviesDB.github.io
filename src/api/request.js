const host = 'https://parseapi.back4app.com';

async function request(method, url, data) {
    const options = {
        method,
        headers: {
            'X-Parse-Application-Id':
                'cqCzjw6xYR8CmCuGLpAC3gd7PWRNFE5NPN4CSMMn',
            'X-Parse-REST-API-Key': 't1PeNvzqtlMdcJqzmIMt6y67ygPzsZakoPWD4CTB',
            'X-Parse-Revocable-Session': 1,
        },
    };

    if (data != undefined) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user) {
        options.headers['X-Parse-Session-Token'] = user.sessionToken;
    }

    try {
        const response = await fetch(host + url, options);

        if (response.ok == false) {
            if (response.status == 403) {
                sessionStorage.removeItem('user');
            }

            const err = await response.json();
            throw new Error(err.error);
        }

        if (response.status == 400) {
            const err = await response.json();
            throw new Error(err.error);
        }

        if (response.status == 204) {
            return response;
        } else {
            return response.json();
        }
    } catch (error) {
        throw error;
    }
}

const get = request.bind(null, 'get');
const post = request.bind(null, 'post');
const put = request.bind(null, 'put');
const del = request.bind(null, 'delete');

export { get, post, put, del };
