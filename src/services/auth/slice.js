import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api';

// Экшены для регистрации, авторизации и работы с пользователем
export const registerUser = createAsyncThunk(
    'auth/register',
    async ({ email, password, name }) => {
        const response = await api.register(email, password, name);
        return response;
    }
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ email, password }) => {
        const response = await api.login(email, password);
        return response;
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (refreshToken) => {
        const response = await api.logout(refreshToken);
        return response;
    }
);

export const updateToken = createAsyncThunk(
    'auth/updateToken',
    async (refreshToken) => {
        const response = await api.updateToken(refreshToken);
        return response;
    }
);

export const getUser = createAsyncThunk(
    'auth/getUser',
    async (accessToken) => {
        const response = await api.getUser(accessToken);
        return response;
    }
);

export const updateUser = createAsyncThunk(
    'auth/updateUser',
    async ({ accessToken, userData }) => {
        const response = await api.updateUser(accessToken, userData);
        return response;
    }
);

// Экшены для восстановления пароля
export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email) => {
        const response = await api.forgotPassword(email);
        return response;
    }
);

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ password, token }) => {
        const response = await api.resetPassword({ password, token });
        return response;
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthChecked: false,
        loading: false,
        error: null,
        passwordResetRequested: false,
        passwordReset: false,
    },
    reducers: {
        setAuthChecked: (state, action) => {
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
            // Регистрация
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.loading = false;
                localStorage.setItem('refreshToken', action.payload.refreshToken);
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Авторизация
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.loading = false;
                localStorage.setItem('refreshToken', action.payload.refreshToken);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Выход из системы
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
                state.error = action.error.message;
            })

            // Обновление токена
            .addCase(updateToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateToken.fulfilled, (state, action) => {
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.loading = false;
                localStorage.setItem('refreshToken', action.payload.refreshToken);
            })
            .addCase(updateToken.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Получение данных пользователя
            .addCase(getUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.isAuthChecked = true;
                state.loading = false;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.isAuthChecked = true;
                state.loading = false;
                state.error = action.error.message;
            })

            // Обновление данных пользователя
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.loading = false;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Запрос на восстановление пароля
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
                state.error = action.error.message;
            })

            // Сброс пароля
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
                state.error = action.error.message;
            });
    },
});

export const { setAuthChecked, clearError, resetPasswordState } = authSlice.actions;
export default authSlice.reducer;