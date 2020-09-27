// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import "@testing-library/cypress/add-commands";

import "cypress-file-upload";

const EMAIL = "test@abc.com";
const PASSWORD = "test123";

const LOGIN_MUTATION = `
  mutation LOGIN_MUTATION($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      name
      email
      username
    }
  }
`;

Cypress.Commands.add("autoLogin", () => {
  cy.request({
    url: "http://localhost:5000/graphql",
    method: "POST",
    body: {
      query: LOGIN_MUTATION,
      variables: {
        email: EMAIL,
        password: PASSWORD,
      },
    },
    failOnStatusCode: false,
  }).then(() => {
    cy.visit("/");

    cy.get("#logoutButton").should("exist");
  });
});
