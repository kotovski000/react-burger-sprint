import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {AppDispatch, RootState, store} from '../services/store';
import { connectFeedOrders, connectProfileOrders, disconnectOrders } from '../services/websocket/actions';
import {updateToken} from "../services/auth/slice";

export const useFeedWebSocket = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { feedOrders, total, totalToday, loading, error, wsConnected } = useSelector(
		(state: RootState) => state.orders
	);

	useEffect(() => {
		dispatch(connectFeedOrders());

		return () => {
			dispatch(disconnectOrders());
		};
	}, [dispatch]);

	return { orders: feedOrders, total, totalToday, loading, error, wsConnected };
};

export const useProfileWebSocket = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { accessToken, accessTokenExpired } = useSelector((state: RootState) => state.auth);
	const { profileOrders, total, totalToday, loading, error, wsConnected } = useSelector(
		(state: RootState) => state.orders
	);

	useEffect(() => {
		if (accessToken && !accessTokenExpired) {
			dispatch(connectProfileOrders(accessToken));
		} else if (accessTokenExpired) {
			const refreshToken = localStorage.getItem('refreshToken');
			if (refreshToken) {
				dispatch(updateToken(refreshToken) as any)
					.unwrap()
					.then(() => {
						const newAccessToken = store.getState().auth.accessToken;
						if (newAccessToken) {
							dispatch(connectProfileOrders(newAccessToken));
						}
					});
			}
		}

		return () => {
			dispatch(disconnectOrders());
		};
	}, [dispatch, accessToken, accessTokenExpired]);

	return { orders: profileOrders, total, totalToday, loading, error, wsConnected };
};