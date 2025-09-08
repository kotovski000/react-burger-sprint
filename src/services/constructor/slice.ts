import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { Ingredient, ConstructorIngredient } from '../../utils/types';

export interface ConstructorState {
	bun: Ingredient | null;
	ingredients: ConstructorIngredient[];
}

export const initialState: ConstructorState = {
	bun: null,
	ingredients: []
};

const constructorSlice = createSlice({
	name: 'burgerConstructor',
	initialState,
	reducers: {
		addIngredient: {
			reducer: (state, action: PayloadAction<ConstructorIngredient>) => {
				if (action.payload.type === 'bun') {
					state.bun = action.payload;
				} else {
					state.ingredients.push(action.payload);
				}
			},
			prepare: (ingredient: Ingredient) => {
				return {
					payload: {
						...ingredient,
						id: nanoid()
					}
				};
			}
		},
		removeIngredient: (state, action: PayloadAction<string>) => {
			state.ingredients = state.ingredients.filter(
				(item) => item.id !== action.payload
			);
		},
		moveIngredient: (
			state,
			action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
		) => {
			const { dragIndex, hoverIndex } = action.payload;

			if (state.ingredients.length === 0 ||
				dragIndex < 0 || dragIndex >= state.ingredients.length ||
				hoverIndex < 0 || hoverIndex >= state.ingredients.length) {
				return;
			}

			const dragItem = state.ingredients[dragIndex];
			state.ingredients.splice(dragIndex, 1);
			state.ingredients.splice(hoverIndex, 0, dragItem);
		},
		clearConstructor: (state) => {
			state.bun = null;
			state.ingredients = [];
		}
	}
});

export const {
	addIngredient,
	removeIngredient,
	moveIngredient,
	clearConstructor
} = constructorSlice.actions;

export default constructorSlice.reducer;