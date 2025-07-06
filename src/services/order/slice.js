import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../../utils/constants';

export const createOrder = createAsyncThunk(
    'order/createOrder',
    async (ingredients, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ingredients })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create order');
            }

            const data = await response.json();
            if (!data.success) {
                throw new Error('Failed to create order');
            }

            return data.order.number;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        number: null,
        loading: false,
        error: null
    },
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
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.number = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearOrder } = orderSlice.actions;

export default orderSlice.reducer;