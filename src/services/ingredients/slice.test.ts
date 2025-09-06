import ingredientsReducer, { fetchIngredients, IngredientsState } from './slice';
import { Ingredient } from '../../utils/types';

const initialState: IngredientsState = {
	items: [],
	loading: false,
	error: null
};

const mockIngredients: Ingredient[] = [
	{
		_id: '1',
		name: 'Bun',
		type: 'bun',
		proteins: 80,
		fat: 24,
		carbohydrates: 53,
		calories: 420,
		price: 100,
		image: 'bun-image.png',
		image_large: 'bun-image-large.png'
	},
	{
		_id: '2',
		name: 'Cheese',
		type: 'main',
		proteins: 25,
		fat: 15,
		carbohydrates: 3,
		calories: 150,
		price: 50,
		image: 'cheese-image.png',
		image_large: 'cheese-image-large.png'
	}
];

describe('ingredients reducer', () => {
	it('should return initial state', () => {
		expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
	});

	it('should handle fetchIngredients.pending', () => {
		const action = fetchIngredients.pending('');
		const state = ingredientsReducer(initialState, action);
		expect(state.loading).toBe(true);
		expect(state.error).toBeNull();
	});

	it('should handle fetchIngredients.fulfilled', () => {
		const action = fetchIngredients.fulfilled(mockIngredients, '');
		const state = ingredientsReducer(initialState, action);
		expect(state.loading).toBe(false);
		expect(state.items).toEqual(mockIngredients);
		expect(state.error).toBeNull();
	});

	it('should handle fetchIngredients.rejected', () => {
		const action = fetchIngredients.rejected(new Error('Failed'), '');
		const state = ingredientsReducer(initialState, action);
		expect(state.loading).toBe(false);
		expect(state.error).toBe('Failed');
		expect(state.items).toHaveLength(0);
	});

	it('should replace existing ingredients on successful fetch', () => {
		const initialWithItems: IngredientsState = {
			items: [mockIngredients[0]],
			loading: false,
			error: null
		};

		const action = fetchIngredients.fulfilled([mockIngredients[1]], '');
		const state = ingredientsReducer(initialWithItems, action);

		expect(state.items).toHaveLength(1);
		expect(state.items[0].name).toBe('Cheese');
	});
});