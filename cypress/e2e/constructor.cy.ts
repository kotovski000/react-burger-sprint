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
		cy.get('[data-testid^="ingredient-"]').should('have.length.at.least', 3);
		cy.get('[data-testid="burger-constructor"]').should('exist');
	});

	it('should drag and drop ingredients to constructor', () => {
		cy.get('[data-testid="ingredient-643d69a5c3f7b9001cfa093c"]')
			.trigger('dragstart');
		cy.get('[data-testid="burger-constructor"]')
			.trigger('drop');

		cy.get('[data-testid="ingredient-643d69a5c3f7b9001cfa0941"]')
			.trigger('dragstart');
		cy.get('[data-testid="burger-constructor"]')
			.trigger('drop');

		cy.get('[data-testid^="constructor-item-"]').should('have.length', 1);
		cy.contains('Краторная булка N-200i (верх)').should('exist');
		cy.contains('Краторная булка N-200i (низ)').should('exist');
	});

	it('should open and close ingredient modal', () => {
		cy.get('[data-testid="ingredient-643d69a5c3f7b9001cfa093c"]').click();

		cy.get('[data-testid="ingredient-image"]').should('be.visible');
		cy.get('[data-testid="ingredient-name"]').should('contain', 'Краторная булка N-200i');

		cy.get('[data-testid="modal-overlay"]').click({ force: true });
		cy.get('[data-testid="ingredient-image"]').should('not.exist');
	});

	it('should create order successfully after login', () => {
		cy.visit('/login');

		cy.get('input[type="email"]').type('mdwdwwd@gmail.com');
		cy.get('input[type="password"]').type('4567');
		cy.get('button[type="submit"]').click();

		cy.wait('@login');
		cy.url().should('eq', 'http://localhost:3000/');

		cy.get('[data-testid="ingredient-643d69a5c3f7b9001cfa093c"]')
			.trigger('dragstart');
		cy.get('[data-testid="burger-constructor"]')
			.trigger('drop');

		cy.get('[data-testid="ingredient-643d69a5c3f7b9001cfa0941"]')
			.trigger('dragstart');
		cy.get('[data-testid="burger-constructor"]')
			.trigger('drop');

		cy.get('button').contains('Оформить заказ').click();

		cy.contains('идентификатор заказа').should('be.visible');
		cy.contains('12345').should('be.visible');
	});

	it('should redirect to login when unauthorized user tries to create order', () => {
		window.localStorage.removeItem('accessToken');
		window.localStorage.removeItem('refreshToken');

		cy.get('[data-testid="ingredient-643d69a5c3f7b9001cfa093c"]')
			.trigger('dragstart');
		cy.get('[data-testid="burger-constructor"]')
			.trigger('drop');

		cy.get('button').contains('Оформить заказ').click();

		cy.url().should('include', '/login');
	});

	it('should remove ingredient from constructor by clicking close icon', () => {
		cy.get('[data-testid="ingredient-643d69a5c3f7b9001cfa0941"]')
			.trigger('dragstart');
		cy.get('[data-testid="burger-constructor"]')
			.trigger('drop');

		cy.get('[data-testid^="constructor-item-"]')
			.within(() => {
				cy.get('*').last().click();
			});

		cy.get('[data-testid^="constructor-item-"]').should('not.exist');
	});

});

export {}