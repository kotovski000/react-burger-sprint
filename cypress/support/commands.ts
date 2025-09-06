declare namespace Cypress {
	interface Chainable {
		dragTo(target: string): Chainable<Element>;
		closeModal(): Chainable<Element>;
		scrollToElement(selector: string): Chainable<Element>;
	}
}

Cypress.Commands.add('dragTo', { prevSubject: 'element' }, (subject, target) => {
	cy.wrap(subject).trigger('dragstart');
	cy.get(target).trigger('drop');
	return cy.wrap(subject);
});

Cypress.Commands.add('closeModal', () => {
	cy.get('body').then(($body) => {
		if ($body.find('[data-testid="modal-close-button"]').length > 0) {
			cy.get('[data-testid="modal-close-button"]').click();
		} else if ($body.find('[data-testid="modal-overlay"]').length > 0) {
			cy.get('[data-testid="modal-overlay"]').click({ force: true });
		} else {
			cy.get('body').type('{esc}');
		}
	});
});

Cypress.Commands.add('scrollToElement', (selector: string) => {
	cy.get(selector).scrollIntoView();
});