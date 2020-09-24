describe("Quote", () => {
  beforeEach(() => {
    cy.autoLogin();
  });

  it("Creates a new quote successfully", () => {
    cy.findByText("New").click();

    cy.get("#content").type("Test content");

    cy.get("#author").type("Test author");

    const picture = "arthur-fleck.jpg";

    cy.get('input[type="file"]').attachFile(picture);

    cy.get("#tag").type("power");

    cy.get('[data-testid="addTag"]').click();

    cy.get("#tag").type("life");

    cy.get('[data-testid="addTag"]').click();

    cy.findByText("life").click();

    cy.get("input[type=submit]")
      .click()
      .then(() =>
        cy.location("pathname").should("eq", "/quotes/test-author-test-content")
      );

    // TODO: find a better way of waiting for graphql mutation to resolve before checking redirect
    // cy.wait(5000);
  });

  it("Likes a quote", () => {
    cy.visit("/quotes/test-author-test-content", { timeout: 5000 });

    cy.get('[data-testid="likeButton"]')
      .click()
      .then(() => {
        cy.get('[data-testid="likeCount"]').contains("1");
      });
  });

  it("Unlikes a quote", () => {
    cy.visit("/quotes/test-author-test-content", { timeout: 5000 });

    cy.get('[data-testid="unlikeButton"]')
      .click()
      .then(() => {
        cy.get('[data-testid="likeCount"]').should("not.visible");
      });
  });

  it("Updates a quote", () => {
    cy.visit("/quotes/test-author-test-content", { timeout: 5000 });

    cy.get('[data-testid="editButton"]').click();

    cy.get("#updateContent").clear().type("Updated content");

    cy.get("#updateAuthor").clear().type("Updated author");

    cy.get("#updateTag").type("life");

    cy.get('[data-testid="updateTags"]').click();

    cy.get("input[type=submit]")
      .click()
      .then(() => {
        cy.location("pathname").should(
          "eq",
          "/quotes/updated-author-updated-content"
        );
      });

    // TODO: find a better way of waiting for graphql mutation to resolve before checking redirect
    // cy.wait(5000);
  });

  it("Deletes a quote", () => {
    cy.visit("/quotes/updated-author-updated-content", { timeout: 5000 });

    cy.get('[data-testid="deleteButton"]').click();

    cy.on("window:confirm", () => true);

    cy.location("pathname").should("eq", "/quotes");
  });
});
