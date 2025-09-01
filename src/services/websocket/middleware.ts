import { Middleware, MiddlewareAPI } from 'redux';
import { AppDispatch, RootState } from '../store';
import {
	wsConnectionStart,
	wsConnectionSuccess,
	wsConnectionError,
	wsConnectionClosed,
	wsGetMessage
} from './slice';
import {updateToken} from '../auth/slice';


export const socketMiddleware = (): Middleware => {
	return (store: MiddlewareAPI<AppDispatch, RootState>) => {
		let socket: WebSocket | null = null;
		let reconnectTimeout: NodeJS.Timeout | null = null;
		const MAX_RECONNECT_ATTEMPTS = 5;
		let reconnectAttempts = 0;

		return next => (action: any) => {
			const { dispatch, getState } = store;

			if (wsConnectionStart.match(action)) {
				const { url, isProfile } = action.payload;

				if (socket) {
					socket.close();
				}

				const connect = () => {
					try {
						if (isProfile) {
							const { auth } = getState();
							if (!auth.accessToken) {
								console.log('WebSocket: No access token for profile connection');
								dispatch(wsConnectionError('Требуется авторизация'));
								return;
							}
						}

						console.log('WebSocket: Connecting to', url);
						socket = new WebSocket(url);

						socket.onopen = () => {
							console.log('WebSocket: Connection established');
							dispatch(wsConnectionSuccess());
							reconnectAttempts = 0;
						};

						socket.onmessage = (event) => {
							try {
								const data = JSON.parse(event.data);
								console.log('WebSocket: Message received', data);

								if (data.success) {
									dispatch(wsGetMessage({
										orders: data.orders,
										total: data.total,
										totalToday: data.totalToday,
										isProfile
									}));
								} else if (data.message === 'Invalid or missing token') {
									console.log('WebSocket: Invalid token');
									dispatch(wsConnectionError('Invalid or missing token'));

									if (isProfile) {
										const refreshToken = localStorage.getItem('refreshToken');
										if (refreshToken) {
											setTimeout(() => {
												dispatch(updateToken(refreshToken))
													.unwrap()
													.then(() => {
														const newAccessToken = getState().auth.accessToken;
														if (newAccessToken) {
															const token = newAccessToken.replace('Bearer ', '');
															dispatch(wsConnectionStart({
																url: `wss://norma.nomoreparties.space/orders?token=${token}`,
																isProfile: true
															}));
														}
													})
													.catch((error) => {
														console.error('WebSocket: Token update failed', error);
														dispatch(wsConnectionError('Не удалось обновить токен'));
													});
											}, 1000);
										}
									}
								} else {
									dispatch(wsConnectionError(data.message || 'Ошибка получения данных'));
								}
							} catch (error) {
								console.error('WebSocket: Parse error', error);
								dispatch(wsConnectionError('Ошибка парсинга данных'));
							}
						};

						socket.onerror = (error) => {
							console.error('WebSocket: Connection error', error);
							dispatch(wsConnectionError('Ошибка WebSocket соединения'));
						};

						socket.onclose = (event) => {
							console.log('WebSocket: Connection closed', event.code, event.reason);
							dispatch(wsConnectionClosed());

							if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
								const delay = Math.min(3000 * Math.pow(2, reconnectAttempts), 30000);
								reconnectAttempts++;
								console.log(`WebSocket: Reconnecting in ${delay}ms (attempt ${reconnectAttempts})`);

								reconnectTimeout = setTimeout(() => {
									connect();
								}, delay);
							}
						};

					} catch (error) {
						console.error('WebSocket: Connection failed', error);
						dispatch(wsConnectionError('Ошибка создания WebSocket соединения'));
					}
				};

				setTimeout(connect, 100);
			}

			if (wsConnectionClosed.match(action)) {
				console.log('WebSocket: Manual disconnect');
				if (reconnectTimeout) {
					clearTimeout(reconnectTimeout);
				}
				if (socket) {
					socket.close();
				}
				socket = null;
				reconnectAttempts = MAX_RECONNECT_ATTEMPTS;
			}

			return next(action);
		};
	};
};