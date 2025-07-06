import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../../utils/constants';

export const fetchIngredients = createAsyncThunk(
    'ingredients/fetchIngredients',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/ingredients`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            if (!data.success) throw new Error('API request was not successful');
            return data.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const ingredientsSlice = createSlice({
    name: 'ingredients',
    initialState: {
        items: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchIngredients.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchIngredients.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchIngredients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default ingredientsSlice.reducer;