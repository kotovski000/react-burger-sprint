import orderReducer, { createOrder, clearOrder, OrderState } from './slice';

const initialState: OrderState = {
	number: null,
	loading: false,
	error: null
};

describe('order reducer', () => {
	it('should return initial state', () => {
		expect(orderReducer(undefined, { type: 'unknown' })).toEqual(initialState);
	});

	it('should handle clearOrder', () => {
		const stateWithData: OrderState = { number: 12345, loading: false, error: 'Some error' };
		const state = orderReducer(stateWithData, clearOrder());
		expect(state.number).toBeNull();
		expect(state.error).toBeNull();
	});

	it('should handle createOrder.pending', () => {
		const action = createOrder.pending('', []);
		const state = orderReducer(initialState, action);
		expect(state.loading).toBe(true);
		expect(state.error).toBeNull();
	});

	it('should handle createOrder.fulfilled', () => {
		const action = createOrder.fulfilled(12345, '', []);
		const state = orderReducer(initialState, action);
		expect(state.loading).toBe(false);
		expect(state.number).toBe(12345);
		expect(state.error).toBeNull();
	});

	it('should handle createOrder.rejected', () => {
		const action = createOrder.rejected(new Error('Failed'), '', []);
		const state = orderReducer(initialState, action);
		expect(state.loading).toBe(false);
		expect(state.error).toBe('Failed');
		expect(state.number).toBeNull();
	});

	it('should clear error on pending', () => {
		const stateWithError: OrderState = { number: null, loading: false, error: 'Previous error' };
		const action = createOrder.pending('', []);
		const state = orderReducer(stateWithError, action);
		expect(state.error).toBeNull();
	});
});