describe("Navigation", () => {
  beforeEach(() => {
    cy.autoLogin();
  });

  it("Links to My Quotes successfully", () => {
    cy.findByText("My Quotes").click();
    cy.location("pathname").should("eq", "/user/test/quotes");
  });

  it("Links to Likes successfully", () => {
    cy.findByText("Likes").click();
    cy.location("pathname").should("eq", "/user/test/likes");
  });

  it("Links to New successfully", () => {
    cy.findByText("New").click();
    cy.location("pathname").should("eq", "/quotes/new");
  });

  it("Links to Quotes successfully", () => {
    cy.findByText("Quotes").click();
    cy.location("pathname").should("eq", "/quotes");
  });
});
