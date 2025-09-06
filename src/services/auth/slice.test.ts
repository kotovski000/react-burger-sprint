import authReducer, {
	registerUser,
	loginUser,
	logoutUser,
	updateToken,
	getUser,
	forgotPassword,
	resetPassword,
	setAuthChecked,
	clearError,
	resetPasswordState,
	AuthState
} from './slice';
import { AuthResponse, User, PasswordResetResponse } from '../../utils/types';

const initialState: AuthState = {
	user: null,
	accessToken: null,
	refreshToken: null,
	isAuthChecked: false,
	loading: false,
	error: null,
	passwordResetRequested: false,
	passwordReset: false,
	accessTokenExpired: false,
};

const mockUser: User = {
	name: 'Test User',
	email: 'test@test.com'
};

describe('auth reducer', () => {
	it('should return initial state', () => {
		expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
	});

	it('should handle setAuthChecked', () => {
		const action = setAuthChecked(true);
		const state = authReducer(initialState, action);
		expect(state.isAuthChecked).toBe(true);
		expect(state.user).toBeNull();
		expect(state.error).toBeNull();
	});

	it('should handle clearError', () => {
		const stateWithError = { ...initialState, error: 'Some error' };
		const state = authReducer(stateWithError, clearError());
		expect(state.error).toBeNull();
	});

	it('should handle resetPasswordState', () => {
		const stateWithReset = {
			...initialState,
			passwordResetRequested: true,
			passwordReset: true
		};
		const state = authReducer(stateWithReset, resetPasswordState());
		expect(state.passwordResetRequested).toBe(false);
		expect(state.passwordReset).toBe(false);
	});

	describe('registerUser', () => {
		it('should handle pending', () => {
			const action = registerUser.pending('', { email: 'test@test.com', password: 'password', name: 'Test User' });
			const state = authReducer(initialState, action);
			expect(state.loading).toBe(true);
			expect(state.error).toBeNull();
		});

		it('should handle fulfilled', () => {
			const mockResponse: AuthResponse = {
				success: true,
				user: mockUser,
				accessToken: 'token123',
				refreshToken: 'refresh123'
			};
			const action = registerUser.fulfilled(mockResponse, '', { email: 'test@test.com', password: 'password', name: 'Test User' });
			const state = authReducer(initialState, action);
			expect(state.loading).toBe(false);
			expect(state.user).toEqual(mockUser);
			expect(state.accessToken).toBe('token123');
			expect(state.refreshToken).toBe('refresh123');
		});

		it('should handle rejected', () => {
			const action = registerUser.rejected(new Error('Registration failed'), '', { email: 'test@test.com', password: 'password', name: 'Test User' });
			const state = authReducer(initialState, action);
			expect(state.loading).toBe(false);
			expect(state.error).toBe('Registration failed');
		});
	});

	describe('loginUser', () => {
		it('should handle pending', () => {
			const action = loginUser.pending('', { email: 'test@test.com', password: 'password' });
			const state = authReducer(initialState, action);
			expect(state.loading).toBe(true);
			expect(state.error).toBeNull();
		});

		it('should handle fulfilled', () => {
			const mockResponse: AuthResponse = {
				success: true,
				user: mockUser,
				accessToken: 'token123',
				refreshToken: 'refresh123'
			};
			const action = loginUser.fulfilled(mockResponse, '', { email: 'test@test.com', password: 'password' });
			const state = authReducer(initialState, action);
			expect(state.loading).toBe(false);
			expect(state.user).toEqual(mockUser);
			expect(state.accessToken).toBe('token123');
			expect(state.refreshToken).toBe('refresh123');
		});

		it('should handle rejected', () => {
			const action = loginUser.rejected(new Error('Login failed'), '', { email: 'test@test.com', password: 'password' });
			const state = authReducer(initialState, action);
			expect(state.loading).toBe(false);
			expect(state.error).toBe('Login failed');
		});
	});

	describe('logoutUser', () => {
		it('should handle pending', () => {
			const action = logoutUser.pending('', 'refreshToken');
			const state = authReducer(initialState, action);
			expect(state.loading).toBe(true);
			expect(state.error).toBeNull();
		});

		it('should handle fulfilled', () => {
			const stateWithData: AuthState = {
				...initialState,
				user: mockUser,
				accessToken: 'token123',
				refreshToken: 'refresh123'
			};
			const action = logoutUser.fulfilled({ success: true }, '', 'refreshToken');
			const state = authReducer(stateWithData, action);
			expect(state.loading).toBe(false);
			expect(state.user).toBeNull();
			expect(state.accessToken).toBeNull();
			expect(state.refreshToken).toBeNull();
		});

		it('should handle rejected', () => {
			const action = logoutUser.rejected(new Error('Logout failed'), '', 'refreshToken');
			const state = authReducer(initialState, action);
			expect(state.loading).toBe(false);
			expect(state.error).toBe('Logout failed');
		});
	});

	describe('updateToken', () => {
		it('should handle pending', () => {
			const action = updateToken.pending('', 'refreshToken');
			const state = authReducer(initialState, action);
			expect(state.loading).toBe(true);
			expect(state.error).toBeNull();
		});

		it('should handle fulfilled', () => {
			const mockResponse: AuthResponse = {
				success: true,
				user: mockUser,
				accessToken: 'newToken123',
				refreshToken: 'newRefresh123'
			};
			const action = updateToken.fulfilled(mockResponse, '', 'refreshToken');
			const state = authReducer(initialState, action);
			expect(state.loading).toBe(false);
			expect(state.accessToken).toBe('newToken123');
			expect(state.refreshToken).toBe('newRefresh123');
		});

		it('should handle rejected', () => {
			const action = updateToken.rejected(new Error('Token update failed'), '', 'refreshToken');
			const state = authReducer(initialState, action);
			expect(state.loading).toBe(false);
			expect(state.error).toBe('Token update failed');
		});
	});

	describe('getUser', () => {
		it('should handle pending', () => {
			const action = getUser.pending('', 'token');
			const state = authReducer(initialState, action);
			expect(state.loading).toBe(true);
			expect(state.error).toBeNull();
		});

		it('should handle fulfilled', () => {
			const mockResponse = {
				success: true,
				user: mockUser
			};
			const action = getUser.fulfilled(mockResponse, '', 'token');
			const state = authReducer(initialState, action);
			expect(state.loading).toBe(false);
			expect(state.user).toEqual(mockUser);
			expect(state.isAuthChecked).toBe(true);
		});

		it('should handle rejected', () => {
			const action = getUser.rejected(new Error('Failed to get user'), '', 'token');
			const state = authReducer(initialState, action);
			expect(state.loading).toBe(false);
			expect(state.isAuthChecked).toBe(true);
			expect(state.error).toBe('Failed to get user');
		});
	});

	describe('forgotPassword', () => {
		it('should handle pending', () => {
			const action = forgotPassword.pending('', 'test@test.com');
			const state = authReducer(initialState, action);
			expect(state.loading).toBe(true);
			expect(state.error).toBeNull();
		});

		it('should handle fulfilled', () => {
			const mockResponse: PasswordResetResponse = {
				success: true,
				message: 'Reset email sent'
			};
			const action = forgotPassword.fulfilled(mockResponse, '', 'test@test.com');
			const state = authReducer(initialState, action);
			expect(state.loading).toBe(false);
			expect(state.passwordResetRequested).toBe(true);
		});

		it('should handle rejected', () => {
			const action = forgotPassword.rejected(new Error('Password reset failed'), '', 'test@test.com');
			const state = authReducer(initialState, action);
			expect(state.loading).toBe(false);
			expect(state.error).toBe('Password reset failed');
		});
	});

	describe('resetPassword', () => {
		it('should handle pending', () => {
			const action = resetPassword.pending('', { password: 'newPass', token: 'resetToken' });
			const state = authReducer(initialState, action);
			expect(state.loading).toBe(true);
			expect(state.error).toBeNull();
		});

		it('should handle fulfilled', () => {
			const mockResponse: PasswordResetResponse = {
				success: true,
				message: 'Password reset'
			};
			const action = resetPassword.fulfilled(mockResponse, '', { password: 'newPass', token: 'resetToken' });
			const state = authReducer(initialState, action);
			expect(state.loading).toBe(false);
			expect(state.passwordReset).toBe(true);
		});

		it('should handle rejected', () => {
			const action = resetPassword.rejected(new Error('Password reset failed'), '', { password: 'newPass', token: 'resetToken' });
			const state = authReducer(initialState, action);
			expect(state.loading).toBe(false);
			expect(state.error).toBe('Password reset failed');
		});
	});
});