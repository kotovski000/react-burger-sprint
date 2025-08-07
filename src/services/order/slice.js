import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { request } from '../../utils/api';

export const createOrder = createAsyncThunk(
    'order/createOrder',
    async (ingredients, { rejectWithValue, getState }) => {
        const { auth } = getState();
        const token = auth.accessToken;

        try {
            const data = await request('/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
                body: JSON.stringify({ ingredients })
            });
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