import constructorReducer, {
	addIngredient,
	removeIngredient,
	moveIngredient,
	clearConstructor,
	initialState,
	ConstructorState
} from './slice';
import { Ingredient, ConstructorIngredient } from '../../utils/types';


const baseBun: Ingredient = {
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
};

const baseCheese: Ingredient = {
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
};

const baseSalad: Ingredient = {
	_id: '3',
	name: 'Salad',
	type: 'main',
	proteins: 5,
	fat: 2,
	carbohydrates: 8,
	calories: 30,
	price: 30,
	image: 'salad-image.png',
	image_large: 'salad-image-large.png'
};

const baseMeat: Ingredient = {
	_id: '4',
	name: 'Meat',
	type: 'main',
	proteins: 40,
	fat: 20,
	carbohydrates: 5,
	calories: 250,
	price: 100,
	image: 'meat-image.png',
	image_large: 'meat-image-large.png'
};

const mockBun: ConstructorIngredient = {
	...baseBun,
	id: 'bun1'
};

const mockCheese: ConstructorIngredient = {
	...baseCheese,
	id: 'cheese1'
};

const mockSalad: ConstructorIngredient = {
	...baseSalad,
	id: 'salad1'
};

const mockMeat: ConstructorIngredient = {
	...baseMeat,
	id: 'meat1'
};

describe('constructor reducer', () => {
	it('should return initial state', () => {
		expect(constructorReducer(undefined, { type: 'unknown' })).toEqual(initialState);
	});

	it('should handle addIngredient for bun', () => {
		const action = addIngredient(baseBun);
		const state = constructorReducer(initialState, action);

		expect(state.bun).toEqual({
			...baseBun,
			id: expect.any(String)
		});
		expect(state.ingredients).toHaveLength(0);
	});

	it('should handle addIngredient for non-bun', () => {
		const action = addIngredient(baseCheese);
		const state = constructorReducer(initialState, action);

		expect(state.bun).toBeNull();
		expect(state.ingredients).toHaveLength(1);
		expect(state.ingredients[0]).toEqual({
			...baseCheese,
			id: expect.any(String)
		});
	});

	it('should handle removeIngredient', () => {
		const initialStateWithIngredients: ConstructorState = {
			bun: null,
			ingredients: [mockCheese, mockSalad]
		};

		const action = removeIngredient(mockCheese.id);
		const state = constructorReducer(initialStateWithIngredients, action);

		expect(state.ingredients).toHaveLength(1);
		expect(state.ingredients[0].id).toBe(mockSalad.id);
	});

	it('should handle moveIngredient', () => {
		const initialStateWithIngredients: ConstructorState = {
			bun: null,
			ingredients: [mockCheese, mockSalad, mockMeat]
		};

		const action = moveIngredient({ dragIndex: 0, hoverIndex: 2 });
		const state = constructorReducer(initialStateWithIngredients, action);

		expect(state.ingredients[0].id).toBe(mockSalad.id);
		expect(state.ingredients[1].id).toBe(mockMeat.id);
		expect(state.ingredients[2].id).toBe(mockCheese.id);
	});

	it('should handle clearConstructor', () => {
		const initialStateWithData: ConstructorState = {
			bun: mockBun,
			ingredients: [mockCheese]
		};

		const state = constructorReducer(initialStateWithData, clearConstructor());

		expect(state.bun).toBeNull();
		expect(state.ingredients).toHaveLength(0);
	});

	it('should replace bun when adding new bun', () => {
		const firstBun: Ingredient = { ...baseBun, _id: 'bun1', name: 'First Bun' };
		const secondBun: Ingredient = { ...baseBun, _id: 'bun2', name: 'Second Bun' };

		let state = constructorReducer(initialState, addIngredient(firstBun));
		expect(state.bun?.name).toBe('First Bun');

		state = constructorReducer(state, addIngredient(secondBun));
		expect(state.bun?.name).toBe('Second Bun');
		expect(state.ingredients).toHaveLength(0);
	});

	it('should not remove bun when removing ingredient with bun id', () => {
		const stateWithBun: ConstructorState = {
			bun: mockBun,
			ingredients: [mockCheese]
		};

		const action = removeIngredient(mockBun.id);
		const state = constructorReducer(stateWithBun, action);

		expect(state.bun).toEqual(mockBun);
		expect(state.ingredients).toHaveLength(1);
	});

	it('should handle moving to same index', () => {
		const initialStateWithIngredients: ConstructorState = {
			bun: null,
			ingredients: [mockCheese, mockSalad]
		};

		const action = moveIngredient({ dragIndex: 0, hoverIndex: 0 });
		const state = constructorReducer(initialStateWithIngredients, action);

		expect(state.ingredients[0].id).toBe(mockCheese.id);
		expect(state.ingredients[1].id).toBe(mockSalad.id);
	});

	it('should add multiple non-bun ingredients', () => {
		let state = constructorReducer(initialState, addIngredient(baseCheese));
		state = constructorReducer(state, addIngredient(baseSalad));
		state = constructorReducer(state, addIngredient(baseMeat));

		expect(state.ingredients).toHaveLength(3);
		expect(state.ingredients[0].name).toBe('Cheese');
		expect(state.ingredients[1].name).toBe('Salad');
		expect(state.ingredients[2].name).toBe('Meat');
	});

	it('should generate unique ids for each ingredient', () => {
		const action1 = addIngredient(baseCheese);
		const action2 = addIngredient(baseSalad);

		let state = constructorReducer(initialState, action1);
		state = constructorReducer(state, action2);

		expect(state.ingredients[0].id).not.toBe(state.ingredients[1].id);
		expect(typeof state.ingredients[0].id).toBe('string');
		expect(typeof state.ingredients[1].id).toBe('string');
	});

	it('should not move ingredient with invalid indices', () => {
		const initialStateWithIngredients: ConstructorState = {
			bun: null,
			ingredients: [mockCheese, mockSalad]
		};

		const action = moveIngredient({ dragIndex: 5, hoverIndex: 10 });
		const state = constructorReducer(initialStateWithIngredients, action);

		expect(state.ingredients).toEqual([mockCheese, mockSalad]);
	});
});