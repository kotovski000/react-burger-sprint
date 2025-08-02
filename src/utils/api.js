export const BASE_URL = "https://norma.nomoreparties.space/api";

const checkResponse = (res) => {
    if (res.ok) {
        return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
};

const checkSuccess = (res) => {
    if (res && res.success) {
        return res;
    }
    return Promise.reject(`Response not successful: ${res}`);
};

export const request = (endpoint, options) => {
    return fetch(`${BASE_URL}${endpoint}`, options)
        .then(checkResponse)
        .then(checkSuccess);
};

export const api = {
    register: (email, password, name) => {
        return request('/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name }),
        });
    },

    login: (email, password) => {
        return request('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
    },

    logout: (refreshToken) => {
        return request('/auth/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: refreshToken }),
        });
    },

    updateToken: (refreshToken) => {
        return request('/auth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: refreshToken }),
        });
    },

    getUser: (accessToken) => {
        return request('/auth/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken,
            },
        });
    },

    updateUser: (accessToken, userData) => {
        return request('/auth/user', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken,
            },
            body: JSON.stringify(userData),
        });
    },

    forgotPassword: (email) => {
        return request('/password-reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
    },

    resetPassword: ({ password, token }) => {
        return request('/password-reset/reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password, token }),
        });
    },
};