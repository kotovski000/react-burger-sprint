import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Orders } from '../../utils/types';

export interface OrdersState {
	feedOrders: Orders[];
	profileOrders: Orders[];
	total: number;
	totalToday: number;
	loading: boolean;
	error: string | null;
	wsConnected: boolean;
}

export const initialState: OrdersState = {
	feedOrders: [],
	profileOrders: [],
	total: 0,
	totalToday: 0,
	loading: false,
	error: null,
	wsConnected: false
};

const ordersSlice = createSlice({
	name: 'orders',
	initialState,
	reducers: {
		wsConnectionStart: (state, action: PayloadAction<{ url: string; isProfile?: boolean }>) => {
			state.loading = true;
			state.error = null;
		},
		wsConnectionSuccess: (state) => {
			state.wsConnected = true;
			state.loading = false;
			state.error = null;
		},
		wsConnectionError: (state, action: PayloadAction<string>) => {
			state.wsConnected = false;
			state.loading = false;
			state.error = action.payload;
		},
		wsConnectionClosed: (state) => {
			state.wsConnected = false;
			state.loading = false;
			state.error = null;
		},
		wsGetMessage: (state, action: PayloadAction<{
			orders: Orders[];
			total: number;
			totalToday: number;
			isProfile?: boolean;
		}>) => {
			const { orders, total, totalToday, isProfile } = action.payload;

			const validOrders = orders.filter(order =>
				order._id &&
				order.number &&
				order.name &&
				Array.isArray(order.ingredients) &&
				order.status &&
				order.createdAt &&
				order.updatedAt
			);

			if (isProfile) {
				state.profileOrders = validOrders;
			} else {
				state.feedOrders = validOrders;
			}

			state.total = total;
			state.totalToday = totalToday;
		},
		clearOrders: (state) => {
			state.feedOrders = [];
			state.profileOrders = [];
			state.total = 0;
			state.totalToday = 0;
			state.error = null;
		}
	}
});

export const {
	wsConnectionStart,
	wsConnectionSuccess,
	wsConnectionError,
	wsConnectionClosed,
	wsGetMessage,
	clearOrders
} = ordersSlice.actions;

export default ordersSlice.reducer;