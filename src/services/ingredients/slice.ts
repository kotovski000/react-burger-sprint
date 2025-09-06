import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { request } from '../../utils/api';
import {Ingredient, IngredientsResponse} from '../../utils/types';

export interface IngredientsState {
	items: Ingredient[];
	loading: boolean;
	error: string | null;
}

export const fetchIngredients = createAsyncThunk(
	'ingredients/fetchIngredients',
	async (_, { rejectWithValue }) => {
		try {
			const data = await request<IngredientsResponse>('/ingredients');
			return data.data;
		} catch (error) {
			return rejectWithValue((error as Error).message);
		}
	}
);

const initialState: IngredientsState = {
	items: [],
	loading: false,
	error: null
};

const ingredientsSlice = createSlice({
	name: 'ingredients',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchIngredients.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchIngredients.fulfilled, (state, action: PayloadAction<Ingredient[]>) => {
				state.loading = false;
				state.items = action.payload;
			})
			.addCase(fetchIngredients.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string || action.error.message || 'Failed';
			});

	}
});

export default ingredientsSlice.reducer;