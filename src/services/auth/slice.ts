import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../utils/api';
import { AuthResponse, User, PasswordResetResponse } from '../../utils/types';

interface AuthState {
	user: User | null;
	accessToken: string | null;
	refreshToken: string | null;
	isAuthChecked: boolean;
	loading: boolean;
	error: string | null;
	passwordResetRequested: boolean;
	passwordReset: boolean;
}

export const registerUser = createAsyncThunk(
	'auth/register',
	async ({ email, password, name }: { email: string; password: string; name: string }) => {
		const response = await api.register(email, password, name);
		return response as AuthResponse;
	}
);

export const loginUser = createAsyncThunk(
	'auth/login',
	async ({ email, password }: { email: string; password: string }) => {
		const response = await api.login(email, password);
		return response as AuthResponse;
	}
);

export const logoutUser = createAsyncThunk(
	'auth/logout',
	async (refreshToken: string) => {
		const response = await api.logout(refreshToken);
		return response as { success: boolean };
	}
);

export const updateToken = createAsyncThunk(
	'auth/updateToken',
	async (refreshToken: string) => {
		const response = await api.updateToken(refreshToken);
		return response as AuthResponse;
	}
);

export const getUser = createAsyncThunk(
	'auth/getUser',
	async (accessToken: string) => {
		const response = await api.getUser(accessToken);
		return response as { success: boolean; user: User };
	}
);

export const updateUser = createAsyncThunk(
	'auth/updateUser',
	async ({ accessToken, userData }: { accessToken: string; userData: Partial<User> }) => {
		const response = await api.updateUser(accessToken, userData);
		return response as { success: boolean; user: User };
	}
);

export const forgotPassword = createAsyncThunk(
	'auth/forgotPassword',
	async (email: string) => {
		const response = await api.forgotPassword(email);
		return response as PasswordResetResponse;
	}
);

export const resetPassword = createAsyncThunk(
	'auth/resetPassword',
	async ({ password, token }: { password: string; token: string }) => {
		const response = await api.resetPassword({ password, token });
		return response as PasswordResetResponse;
	}
);

const initialState: AuthState = {
	user: null,
	accessToken: null,
	refreshToken: null,
	isAuthChecked: false,
	loading: false,
	error: null,
	passwordResetRequested: false,
	passwordReset: false,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setAuthChecked: (state, action: PayloadAction<boolean>) => {
			state.isAuthChecked = action.payload;
		},
		clearError: (state) => {
			state.error = null;
		},
		resetPasswordState: (state) => {
			state.passwordResetRequested = false;
			state.passwordReset = false;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(registerUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(registerUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
				state.user = action.payload.user;
				state.accessToken = action.payload.accessToken;
				state.refreshToken = action.payload.refreshToken;
				state.loading = false;
				localStorage.setItem('refreshToken', action.payload.refreshToken);
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Registration failed';
			})
			.addCase(loginUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
				state.user = action.payload.user;
				state.accessToken = action.payload.accessToken;
				state.refreshToken = action.payload.refreshToken;
				state.loading = false;
				localStorage.setItem('accessToken', action.payload.accessToken);
				localStorage.setItem('refreshToken', action.payload.refreshToken);
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Login failed';
			})
			.addCase(logoutUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(logoutUser.fulfilled, (state) => {
				state.user = null;
				state.accessToken = null;
				state.refreshToken = null;
				state.loading = false;
				localStorage.removeItem('refreshToken');
			})
			.addCase(logoutUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Logout failed';
			})
			.addCase(updateToken.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateToken.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
				state.accessToken = action.payload.accessToken;
				state.refreshToken = action.payload.refreshToken;
				state.loading = false;
				localStorage.setItem('refreshToken', action.payload.refreshToken);
			})
			.addCase(updateToken.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Token update failed';
			})
			.addCase(getUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(getUser.fulfilled, (state, action: PayloadAction<{ success: boolean; user: User }>) => {
				state.user = action.payload.user;
				state.isAuthChecked = true;
				state.loading = false;
			})
			.addCase(getUser.rejected, (state, action) => {
				state.isAuthChecked = true;
				state.loading = false;
				state.error = action.error.message || 'Failed to get user';
			})
			.addCase(updateUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateUser.fulfilled, (state, action: PayloadAction<{ success: boolean; user: User }>) => {
				state.user = action.payload.user;
				state.loading = false;
			})
			.addCase(updateUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Update failed';
			})
			.addCase(forgotPassword.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(forgotPassword.fulfilled, (state) => {
				state.loading = false;
				state.passwordResetRequested = true;
			})
			.addCase(forgotPassword.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Password reset failed';
			})
			.addCase(resetPassword.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(resetPassword.fulfilled, (state) => {
				state.loading = false;
				state.passwordReset = true;
			})
			.addCase(resetPassword.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Password reset failed';
			});
	}
});

export const { setAuthChecked, clearError, resetPasswordState } = authSlice.actions;
export default authSlice.reducer;