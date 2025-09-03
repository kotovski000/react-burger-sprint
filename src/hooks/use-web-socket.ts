import { useEffect } from 'react';
import { store } from '../services/store';
import { connectFeedOrders, connectProfileOrders, disconnectOrders } from '../services/websocket/actions';
import { updateToken } from "../services/auth/slice";
import { useAppDispatch, useAppSelector } from "./redux";

export const useFeedWebSocket = () => {
	const dispatch = useAppDispatch();
	const { feedOrders, total, totalToday, loading, error, wsConnected } = useAppSelector(
		state => state.orders
	);
	useEffect(() => {
		const connectTimeout = setTimeout(() => {
			dispatch(connectFeedOrders());
		}, 500);

		return () => {
			clearTimeout(connectTimeout);
			dispatch(disconnectOrders());
		};
	}, [dispatch]);

	return { orders: feedOrders, total, totalToday, loading, error, wsConnected };
};

export const useProfileWebSocket = () => {
	const dispatch = useAppDispatch();
	const { accessToken, accessTokenExpired } = useAppSelector(state => state.auth);
	const { profileOrders, total, totalToday, loading, error, wsConnected } = useAppSelector(
		state => state.orders
	);

	useEffect(() => {
		let connectTimeout: NodeJS.Timeout;

		if (accessToken && !accessTokenExpired) {
			connectTimeout = setTimeout(() => {
				dispatch(connectProfileOrders(accessToken));
			}, 500);
		} else if (accessTokenExpired) {
			const refreshToken = localStorage.getItem('refreshToken');
			if (refreshToken) {
				dispatch(updateToken(refreshToken) as any)
					.unwrap()
					.then(() => {
						const newAccessToken = store.getState().auth.accessToken;
						if (newAccessToken) {
							connectTimeout = setTimeout(() => {
								dispatch(connectProfileOrders(newAccessToken));
							}, 500); // 500ms delay
						}
					});
			}
		}

		return () => {
			if (connectTimeout) clearTimeout(connectTimeout);
			dispatch(disconnectOrders());
		};
	}, [dispatch, accessToken, accessTokenExpired]);

	return { orders: profileOrders, total, totalToday, loading, error, wsConnected };
};
