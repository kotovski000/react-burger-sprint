import { createSlice } from '@reduxjs/toolkit';

const constructorSlice = createSlice({
    name: 'burgerConstructor',
    initialState: {
        bun: null,
        ingredients: []
    },
    reducers: {
        addIngredient: (state, action) => {
            if (action.payload.type === 'bun') {
                state.bun = action.payload;
            } else {
                state.ingredients.push({
                    ...action.payload,
                    id: `${action.payload._id}-${Date.now()}`
                });
            }
        },
        removeIngredient: (state, action) => {
            state.ingredients = state.ingredients.filter(
                (item) => item.id !== action.payload
            );
        },
        moveIngredient: (state, action) => {
            const { dragIndex, hoverIndex } = action.payload;
            const dragItem = state.ingredients[dragIndex];
            state.ingredients.splice(dragIndex, 1);
            state.ingredients.splice(hoverIndex, 0, dragItem);
        },
        // clearConstructor: (state) => {
        //     state.bun = null;
        //     state.ingredients = [];
        // }
    }
});

export const {
    addIngredient,
    removeIngredient,
    moveIngredient,
    // clearConstructor
} = constructorSlice.actions;

export default constructorSlice.reducer;