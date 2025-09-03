import { wsConnectionStart, wsConnectionClosed } from './slice';

export const connectFeedOrders = () =>
	wsConnectionStart({ url: 'wss://norma.nomoreparties.space/orders/all' });

export const connectProfileOrders = (accessToken: string) => {
	const token = accessToken.startsWith('Bearer ') ? accessToken.slice(7) : accessToken;
	return wsConnectionStart({
		url: `wss://norma.nomoreparties.space/orders?token=${token}`,
		isProfile: true
	});
};

export const disconnectOrders = () => wsConnectionClosed();