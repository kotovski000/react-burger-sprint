import ingredientDetailsReducer, {
	setIngredientDetails,
	clearIngredientDetails,
	IngredientDetailsState
} from './slice';
import { Ingredient } from '../../utils/types';

const initialState: IngredientDetailsState = {
	item: null
};

const mockIngredient: Ingredient = {
	_id: '1',
	name: 'Test Ingredient',
	type: 'main',
	proteins: 20,
	fat: 10,
	carbohydrates: 5,
	calories: 150,
	price: 100,
	image: 'image.png',
	image_large: 'image-large.png'
};

describe('ingredientDetails reducer', () => {
	it('should return initial state', () => {
		expect(ingredientDetailsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
	});

	it('should handle setIngredientDetails', () => {
		const action = setIngredientDetails(mockIngredient);
		const state = ingredientDetailsReducer(initialState, action);
		expect(state.item).toEqual(mockIngredient);
	});

	it('should handle clearIngredientDetails', () => {
		const stateWithItem = { item: mockIngredient };
		const state = ingredientDetailsReducer(stateWithItem, clearIngredientDetails());
		expect(state.item).toBeNull();
	});

	it('should replace existing ingredient details', () => {
		const firstIngredient: Ingredient = { ...mockIngredient, _id: '1', name: 'First' };
		const secondIngredient: Ingredient = { ...mockIngredient, _id: '2', name: 'Second' };

		let state = ingredientDetailsReducer(initialState, setIngredientDetails(firstIngredient));
		expect(state.item?.name).toBe('First');

		state = ingredientDetailsReducer(state, setIngredientDetails(secondIngredient));
		expect(state.item?.name).toBe('Second');
	});
});