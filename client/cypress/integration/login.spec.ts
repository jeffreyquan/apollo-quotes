describe("Login", () => {
  const EMAIL = "test@abc.com";
  const PASSWORD = "test123";

  it("Navigates successfully to home page and redirects to quote page", () => {
    cy.visit("/");
    cy.location("pathname").should("eq", "/quotes");
  });

  it("Logins successfully with correct credentials", () => {
    cy.findByText("Sign In").click();

    cy.get("#email").type(EMAIL);
    cy.get("#password").type(PASSWORD);
    cy.get("input[type=submit]")
      .click()
      .then(() => {
        cy.location("pathname").should("eq", "/quotes");
      });
    cy.get("#logoutButton").click();
  });

  it("Fails to login with incorrect credentials", () => {
    cy.findByText("Sign In").click();

    cy.get("#email").type(EMAIL);
    cy.get("#password").type("password");
    cy.get("input[type=submit]")
      .click()
      .then(() => {
        cy.location("pathname").should("eq", "/signin");
      });
  });
});
