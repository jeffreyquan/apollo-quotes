describe("Quote", () => {
  beforeEach(() => {
    cy.autoLogin();
  });

  it("Creates a new quote successfully", () => {
    cy.findByText("New").click();

    cy.get("#content").type("Test content");

    cy.get("#author").type("Test author");

    const picture = "albert-einstein.jpg";

    cy.get('input[type="file"]').attachFile(picture);

    cy.get("#tag").type("power");

    cy.get('[data-testid="addTag"]').click();

    cy.get("#tag").type("life");

    cy.get('[data-testid="addTag"]').click();

    cy.findByText("life").click();

    cy.get("input[type=submit]").click();

    // TODO: find a better way of waiting for graphql mutation to resolve before checking redirect
    cy.wait(100000);

    cy.location("pathname").should("eq", "/quotes/test-author-test-content");
  });
});
