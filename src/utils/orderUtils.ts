import { Orders } from './types';

export const serializeOrder = (order: Orders) => {
	return {
		_id: order._id,
		ingredients: [...order.ingredients],
		status: order.status,
		name: order.name,
		number: order.number,
		createdAt: order.createdAt,
		updatedAt: order.updatedAt
	};
};

export const deserializeOrder = (data: any): Orders => {
	return {
		_id: data._id,
		ingredients: data.ingredients,
		status: data.status,
		name: data.name,
		number: data.number,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt
	};
};