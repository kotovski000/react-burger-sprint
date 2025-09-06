import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { request } from '../../utils/api';
import { RootState } from '../store';
import {OrderResponse} from "../../utils/types";

export interface OrderState {
	number: number | null;
	loading: boolean;
	error: string | null;
}

export const createOrder = createAsyncThunk(
	'order/createOrder',
	async (ingredients: string[], { rejectWithValue, getState }) => {
		const { auth } = getState() as RootState;
		const token = auth.accessToken;

		try {
			const data = await request<OrderResponse>('/orders', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `${token}`,
				},
				body: JSON.stringify({ ingredients })
			});
			return data.order.number;
		} catch (error) {
			return rejectWithValue((error as Error).message);
		}
	}
);

const initialState: OrderState = {
	number: null,
	loading: false,
	error: null
};

const orderSlice = createSlice({
	name: 'order',
	initialState,
	reducers: {
		clearOrder: (state) => {
			state.number = null;
			state.error = null;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(createOrder.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createOrder.fulfilled, (state, action: PayloadAction<number>) => {
				state.loading = false;
				state.number = action.payload;
			})
			.addCase(createOrder.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string || action.error.message || 'Failed';
			});

	}
});

export const { clearOrder } = orderSlice.actions;

export default orderSlice.reducer;