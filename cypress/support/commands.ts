declare global {
	namespace Cypress {
		interface Chainable {

			dragIngredientToConstructor(ingredientId: string): Chainable<Element>

			login(email: string, password: string): Chainable<void>


			clearAuth(): Chainable<void>
		}
	}
}

Cypress.Commands.add('dragIngredientToConstructor', (ingredientId: string) => {
	cy.get(`[data-testid="ingredient-${ingredientId}"]`)
		.trigger('dragstart');
	cy.get('[data-testid="burger-constructor"]')
		.trigger('drop');
});

Cypress.Commands.add('login', (email: string, password: string) => {
	cy.visit('/login');
	cy.get('input[type="email"]').type(email);
	cy.get('input[type="password"]').type(password);
	cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('clearAuth', () => {
	window.localStorage.removeItem('accessToken');
	window.localStorage.removeItem('refreshToken');
});

export {};