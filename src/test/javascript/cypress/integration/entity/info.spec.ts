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

describe('Info e2e test', () => {
  const infoPageUrl = '/info';
  const infoPageUrlPattern = new RegExp('/info(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'admin';
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin';
  const infoSample = {};

  let info: any;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.visit('');
    cy.login(username, password);
    cy.get(entityItemSelector).should('exist');
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/infos+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/infos').as('postEntityRequest');
    cy.intercept('DELETE', '/api/infos/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (info) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/infos/${info.id}`,
      }).then(() => {
        info = undefined;
      });
    }
  });

  it('Infos menu should load Infos page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('info');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Info').should('exist');
    cy.url().should('match', infoPageUrlPattern);
  });

  describe('Info page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(infoPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Info page', () => {
        cy.get(entityCreateButtonSelector).click({ force: true });
        cy.url().should('match', new RegExp('/info/new$'));
        cy.getEntityCreateUpdateHeading('Info');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', infoPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/infos',
          body: infoSample,
        }).then(({ body }) => {
          info = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/infos+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [info],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(infoPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Info page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('info');
        cy.get(entityDetailsBackButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', infoPageUrlPattern);
      });

      it('edit button click should load edit Info page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Info');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', infoPageUrlPattern);
      });

      it('last delete button click should delete instance of Info', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('info').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', infoPageUrlPattern);

        info = undefined;
      });
    });
  });

  describe('new Info page', () => {
    beforeEach(() => {
      cy.visit(`${infoPageUrl}`);
      cy.get(entityCreateButtonSelector).click({ force: true });
      cy.getEntityCreateUpdateHeading('Info');
    });

    it('should create an instance of Info', () => {
      cy.get(`[data-cy="address"]`).type('copy IB').should('have.value', 'copy IB');

      cy.get(`[data-cy="phone"]`).type('379.518.9458').should('have.value', '379.518.9458');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        info = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', infoPageUrlPattern);
    });
  });
});
