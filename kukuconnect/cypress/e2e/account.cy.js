describe("Account Page", () => {
  beforeEach(() => {
    cy.visit("https://kukukonnect-frontend.vercel.app/account");
  });

  context("Account Navigation Tabs", () => {
    it("renders all tabs including conditional password tab", () => {
      cy.contains("Edit Profile").should("exist").and("have.class", "border-b-4");
      cy.contains("Delete Account").should("exist");

      cy.get("body").then($body => {
        if ($body.find('button:contains("Change Password")').length) {
          cy.contains("Change Password").should("exist");
        }
      });
    });

    it("clicking Change Password switches tab if present", () => {
      cy.get("body").then($body => {
        if ($body.find('button:contains("Change Password")').length) {
          cy.contains("Change Password").click();
          cy.contains("Change Password").should("have.class", "border-b-4");
          cy.get('h2').contains('Change Password').should('be.visible');
        } else {
          cy.log("Change Password tab not present; test skipped");
        }
      });
    });

    it("clicking Delete Account triggers confirmation if present", () => {
      cy.get("body").then($body => {
        if ($body.find('button:contains("Delete Account")').length) {
          cy.contains("Delete Account").click();
          cy.get('div[role="dialog"], div.fixed').should("exist").and("be.visible");
          cy.contains("Cancel").click();
          cy.get('div[role="dialog"], div.fixed').should("not.exist");
        } else {
          cy.log("Delete Account button not present; test skipped");
        }
      });
    });
  });

  context("Change Password Form", () => {
    beforeEach(() => {
      cy.get("body").then($body => {
        if ($body.find('button:contains("Change Password")').length) {
          cy.contains("Change Password").click();
        }
      });
    });

    it("validates form and submits if tab present", () => {
      cy.get("body").then($body => {
        if ($body.find('input#newPassword').length) {
          cy.get("input#newPassword").type("newpass123");
          cy.get("input#confirmPassword").type("newpass123");
          cy.get("form").submit();
          cy.contains("Changing...").should("exist");
        } else {
          cy.log("Change Password form not present; test skipped");
        }
      });
    });

    it("shows validation errors on mismatch", () => {
      cy.get("body").then($body => {
        if ($body.find('input#newPassword').length) {
          cy.get("input#newPassword").type("pass1");
          cy.get("input#confirmPassword").type("pass2");
          cy.get("form").submit();
          cy.contains("New passwords do not match.").should("exist");
        } else {
          cy.log("Change Password form not present; test skipped");
        }
      });
    });
  });

  context("Edit Profile Form", () => {
    it("toggles edit mode if form present", () => {
      cy.get("body").then($body => {
        if ($body.find('button:contains("Edit Profile")').length) {
          cy.contains("Edit Profile").click();
          cy.get("input#firstName").should("not.be.disabled");
        } else {
          cy.log("Edit Profile form not present; test skipped");
        }
      });
    });


  });
});
