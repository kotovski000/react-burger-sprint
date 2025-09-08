const INGREDIENT_SELECTOR = '[data-testid^="ingredient-"]';
const CONSTRUCTOR_SELECTOR = '[data-testid="burger-constructor"]';
const MODAL_OVERLAY_SELECTOR = '[data-testid="modal-overlay"]';
const ORDER_BUTTON_SELECTOR = 'button:contains("Оформить заказ")';

const BUN_ID = '643d69a5c3f7b9001cfa093c';
const MAIN_ID = '643d69a5c3f7b9001cfa0941';
const BUN_NAME = 'Краторная булка N-200i';

describe('Burger Constructor', () => {
	beforeEach(() => {
		cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
		cy.intercept('POST', 'api/auth/login', { fixture: 'login.json' }).as('login');
		cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as('getUser');
		cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('createOrder');

		window.localStorage.clear();
		cy.visit('/');
		cy.wait('@getIngredients');
	});

	it('should display ingredients and constructor sections', () => {
		cy.get(INGREDIENT_SELECTOR).should('have.length.at.least', 3);
		cy.get(CONSTRUCTOR_SELECTOR).should('exist');
	});

	it('should drag and drop ingredients to constructor', () => {
		cy.get(`[data-testid="ingredient-${BUN_ID}"]`)
			.trigger('dragstart');
		cy.get(CONSTRUCTOR_SELECTOR)
			.trigger('drop');

		cy.get(`[data-testid="ingredient-${MAIN_ID}"]`)
			.trigger('dragstart');
		cy.get(CONSTRUCTOR_SELECTOR)
			.trigger('drop');

		cy.get('[data-testid^="constructor-item-"]').should('have.length', 1);
		cy.contains(`${BUN_NAME} (верх)`).should('exist');
		cy.contains(`${BUN_NAME} (низ)`).should('exist');
	});

	it('should open and close ingredient modal', () => {
		cy.get(`[data-testid="ingredient-${BUN_ID}"]`).click();

		cy.get('[data-testid="ingredient-image"]').should('be.visible');
		cy.get('[data-testid="ingredient-name"]').should('contain', BUN_NAME);

		cy.get(MODAL_OVERLAY_SELECTOR).click({ force: true });
		cy.get('[data-testid="ingredient-image"]').should('not.exist');
	});

	it('should create order successfully after login', () => {
		cy.visit('/login');

		cy.get('input[type="email"]').type('mdwdwwd@gmail.com');
		cy.get('input[type="password"]').type('4567');
		cy.get('button[type="submit"]').click();

		cy.wait('@login');
		cy.url().should('eq', 'http://localhost:3000/');

		cy.dragIngredientToConstructor(BUN_ID);
		cy.dragIngredientToConstructor(MAIN_ID);

		cy.get(ORDER_BUTTON_SELECTOR).click();
		cy.wait('@createOrder');

		cy.contains('идентификатор заказа').should('be.visible');
		cy.contains('12345').should('be.visible');
	});

	it('should redirect to login when unauthorized user tries to create order', () => {
		window.localStorage.removeItem('accessToken');
		window.localStorage.removeItem('refreshToken');

		cy.dragIngredientToConstructor(BUN_ID);
		cy.get(ORDER_BUTTON_SELECTOR).click();

		cy.url().should('include', '/login');
	});

	it('should remove ingredient from constructor by clicking close icon', () => {
		cy.dragIngredientToConstructor(MAIN_ID);

		cy.get('[data-testid^="constructor-item-"]')
			.as('constructorItem')
			.within(() => {
				cy.get('*').last().click();
			});

		cy.get('@constructorItem').should('not.exist');
	});
});

export {}