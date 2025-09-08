import ordersReducer, {
	wsConnectionStart,
	wsConnectionSuccess,
	wsConnectionError,
	wsConnectionClosed,
	wsGetMessage,
	clearOrders,
	OrdersState,
	initialState
} from './slice';
import { Orders } from '../../utils/types';

const mockOrders: Orders[] = [
	{
		_id: '1',
		ingredients: ['ing1', 'ing2'],
		status: 'created',
		name: 'Order 1',
		createdAt: '2023-01-01T00:00:00.000Z',
		updatedAt: '2023-01-01T00:00:00.000Z',
		number: 1
	},
	{
		_id: '2',
		ingredients: ['ing3', 'ing4'],
		status: 'done',
		name: 'Order 2',
		createdAt: '2023-01-02T00:00:00.000Z',
		updatedAt: '2023-01-02T00:00:00.000Z',
		number: 2
	}
];

describe('orders reducer', () => {
	it('should return initial state', () => {
		expect(ordersReducer(undefined, { type: 'unknown' })).toEqual(initialState);
	});

	it('should handle wsConnectionStart', () => {
		const action = wsConnectionStart({ url: 'ws://test', isProfile: false });
		const state = ordersReducer(initialState, action);
		expect(state.loading).toBe(true);
		expect(state.error).toBeNull();
	});

	it('should handle wsConnectionSuccess', () => {
		const action = wsConnectionSuccess();
		const state = ordersReducer(initialState, action);
		expect(state.wsConnected).toBe(true);
		expect(state.loading).toBe(false);
		expect(state.error).toBeNull();
	});

	it('should handle wsConnectionError', () => {
		const action = wsConnectionError('Connection failed');
		const state = ordersReducer(initialState, action);
		expect(state.wsConnected).toBe(false);
		expect(state.loading).toBe(false);
		expect(state.error).toBe('Connection failed');
	});

	it('should handle wsConnectionClosed', () => {
		const connectedState: OrdersState = {
			...initialState,
			wsConnected: true,
			loading: true,
			error: 'Some error'
		};
		const action = wsConnectionClosed();
		const state = ordersReducer(connectedState, action);
		expect(state.wsConnected).toBe(false);
		expect(state.loading).toBe(false);
		expect(state.error).toBeNull();
	});

	it('should handle wsGetMessage for feed orders', () => {
		const action = wsGetMessage({
			orders: mockOrders,
			total: 100,
			totalToday: 10,
			isProfile: false
		});
		const state = ordersReducer(initialState, action);
		expect(state.feedOrders).toEqual(mockOrders);
		expect(state.profileOrders).toHaveLength(0);
		expect(state.total).toBe(100);
		expect(state.totalToday).toBe(10);
	});

	it('should handle wsGetMessage for profile orders', () => {
		const action = wsGetMessage({
			orders: mockOrders,
			total: 50,
			totalToday: 5,
			isProfile: true
		});
		const state = ordersReducer(initialState, action);
		expect(state.profileOrders).toEqual(mockOrders);
		expect(state.feedOrders).toHaveLength(0);
		expect(state.total).toBe(50);
		expect(state.totalToday).toBe(5);
	});

	it('should handle clearOrders', () => {
		const stateWithData: OrdersState = {
			feedOrders: mockOrders,
			profileOrders: mockOrders,
			total: 100,
			totalToday: 10,
			loading: false,
			error: 'Some error',
			wsConnected: true
		};
		const state = ordersReducer(stateWithData, clearOrders());
		expect(state.feedOrders).toHaveLength(0);
		expect(state.profileOrders).toHaveLength(0);
		expect(state.total).toBe(0);
		expect(state.totalToday).toBe(0);
		expect(state.error).toBeNull();
	});

	it('should filter invalid orders in wsGetMessage', () => {
		const invalidOrders = [
			{ _id: '1', name: 'Valid' } as any,
			...mockOrders
		];

		const action = wsGetMessage({
			orders: invalidOrders,
			total: 100,
			totalToday: 10,
			isProfile: false
		});
		const state = ordersReducer(initialState, action);

		expect(state.feedOrders).toHaveLength(2);
		expect(state.feedOrders[0]._id).toBe('1');
		expect(state.feedOrders[1]._id).toBe('2');
	});
});