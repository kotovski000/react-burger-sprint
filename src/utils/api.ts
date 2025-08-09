import {AuthResponse, PasswordResetResponse, User} from "./types";
import {BASE_URL} from "./constants";


const checkResponse = async (res: Response) => {
	if (res.ok) {
		return res.json();
	}
	return Promise.reject(`Error: ${res.status}`);
};

const checkSuccess = <T extends { success: boolean }>(res: T): T => {
	if (res && res.success) {
		return res;
	}
	throw new Error(`Response not successful: ${JSON.stringify(res)}`);
};

export const request = async <T extends { success: boolean; }>(endpoint: string, options?: RequestInit): Promise<T> => {
	const response = await fetch(`${BASE_URL}${endpoint}`, options);
	const data = await checkResponse(response);
	return checkSuccess<T>(data);
};

interface Api {
	register: (email: string, password: string, name: string) => Promise<AuthResponse>;
	login: (email: string, password: string) => Promise<AuthResponse>;
	logout: (refreshToken: string) => Promise<{ success: boolean }>;
	updateToken: (refreshToken: string) => Promise<AuthResponse>;
	getUser: (accessToken: string) => Promise<{ success: boolean; user: User }>;
	updateUser: (accessToken: string, userData: Partial<User>) => Promise<{ success: boolean; user: User }>;
	forgotPassword: (email: string) => Promise<PasswordResetResponse>;
	resetPassword: (payload: { password: string; token: string }) => Promise<PasswordResetResponse>;
}

export const api: Api = {
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