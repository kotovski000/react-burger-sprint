import { Middleware, MiddlewareAPI } from 'redux';
import { AppDispatch, RootState } from '../store';

export interface TWsActions {
	wsConnectionStart: any;
	wsConnectionSuccess: any;
	wsConnectionError: any;
	wsConnectionClosed: any;
	wsGetMessage: any;
}

export const socketMiddleware = (wsActions: TWsActions): Middleware => {
	return (store: MiddlewareAPI<AppDispatch, RootState>) => {
		let socket: WebSocket | null = null;
		let reconnectTimeout: NodeJS.Timeout | null = null;
		const MAX_RECONNECT_ATTEMPTS = 10;
		let reconnectAttempts = 0;

		return next => (action: any) => {
			const { dispatch } = store;
			const {
				wsConnectionStart,
				wsConnectionSuccess,
				wsConnectionError,
				wsConnectionClosed,
				wsGetMessage
			} = wsActions;

			if (wsConnectionStart.match(action)) {
				const { url, isProfile } = action.payload;

				if (socket) {
					socket.close();
					socket = null;
				}

				const connect = () => {
					try {
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
									socket?.close();
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

				connect();
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