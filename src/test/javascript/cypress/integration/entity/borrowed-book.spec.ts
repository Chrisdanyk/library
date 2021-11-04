import { entityItemSelector } from '../../support/commands';
import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('BorrowedBook e2e test', () => {
  const borrowedBookPageUrl = '/borrowed-book';
  const borrowedBookPageUrlPattern = new RegExp('/borrowed-book(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'admin';
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin';
  const borrowedBookSample = { status: 'BORROWED' };

  let borrowedBook: any;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.visit('');
    cy.login(username, password);
    cy.get(entityItemSelector).should('exist');
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/borrowed-books+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/borrowed-books').as('postEntityRequest');
    cy.intercept('DELETE', '/api/borrowed-books/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (borrowedBook) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/borrowed-books/${borrowedBook.id}`,
      }).then(() => {
        borrowedBook = undefined;
      });
    }
  });

  it('BorrowedBooks menu should load BorrowedBooks page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('borrowed-book');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('BorrowedBook').should('exist');
    cy.url().should('match', borrowedBookPageUrlPattern);
  });

  describe('BorrowedBook page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(borrowedBookPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create BorrowedBook page', () => {
        cy.get(entityCreateButtonSelector).click({ force: true });
        cy.url().should('match', new RegExp('/borrowed-book/new$'));
        cy.getEntityCreateUpdateHeading('BorrowedBook');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', borrowedBookPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/borrowed-books',
          body: borrowedBookSample,
        }).then(({ body }) => {
          borrowedBook = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/borrowed-books+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [borrowedBook],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(borrowedBookPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details BorrowedBook page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('borrowedBook');
        cy.get(entityDetailsBackButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', borrowedBookPageUrlPattern);
      });

      it('edit button click should load edit BorrowedBook page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('BorrowedBook');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', borrowedBookPageUrlPattern);
      });

      it('last delete button click should delete instance of BorrowedBook', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('borrowedBook').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', borrowedBookPageUrlPattern);

        borrowedBook = undefined;
      });
    });
  });

  describe('new BorrowedBook page', () => {
    beforeEach(() => {
      cy.visit(`${borrowedBookPageUrl}`);
      cy.get(entityCreateButtonSelector).click({ force: true });
      cy.getEntityCreateUpdateHeading('BorrowedBook');
    });

    it('should create an instance of BorrowedBook', () => {
      cy.get(`[data-cy="borrowDate"]`).type('2021-11-04').should('have.value', '2021-11-04');

      cy.get(`[data-cy="returnDate"]`).type('2021-11-03').should('have.value', '2021-11-03');

      cy.get(`[data-cy="status"]`).select('BORROWED');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        borrowedBook = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', borrowedBookPageUrlPattern);
    });
  });
});
