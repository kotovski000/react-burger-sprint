import { createSlice } from '@reduxjs/toolkit';

const ingredientDetailsSlice = createSlice({
    name: 'ingredientDetails',
    initialState: {
        item: null
    },
    reducers: {
        setIngredientDetails: (state, action) => {
            state.item = action.payload;
        },
        clearIngredientDetails: (state) => {
            state.item = null;
        }
    }
});

export const { setIngredientDetails, clearIngredientDetails } =
    ingredientDetailsSlice.actions;

export default ingredientDetailsSlice.reducer;