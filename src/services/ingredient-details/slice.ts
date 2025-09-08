import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Ingredient } from '../../utils/types';

interface IngredientDetailsState {
	item: Ingredient | null;
}

export const initialState: IngredientDetailsState = {
	item: null
};

const ingredientDetailsSlice = createSlice({
	name: 'ingredientDetails',
	initialState,
	reducers: {
		setIngredientDetails: (state, action: PayloadAction<Ingredient>) => {
			state.item = action.payload;
		},
		clearIngredientDetails: (state) => {
			state.item = null;
		}
	}
});

export const { setIngredientDetails, clearIngredientDetails } = ingredientDetailsSlice.actions;
export default ingredientDetailsSlice.reducer;