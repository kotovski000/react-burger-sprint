import {getUser, setAuthChecked, updateToken} from './slice';

export const checkUserAuth = () => {
    return async (dispatch, getState) => {
        if (getState().auth.isAuthChecked) {
            return;
        }

        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            dispatch(setAuthChecked(true));
            return;
        }

        try {
            const accessToken = getState().auth.accessToken;
            if (accessToken) {
                await dispatch(getUser(accessToken));
            } else {
                const updateResponse = await dispatch(updateToken(refreshToken));
                if (updateResponse.payload?.accessToken) {
                    await dispatch(getUser(updateResponse.payload.accessToken));
                }
            }
        } catch (error) {
            console.error('Failed to check auth:', error);
        } finally {
            dispatch(setAuthChecked(true));
        }
    };
};