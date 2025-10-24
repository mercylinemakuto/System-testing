
describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("https://kukukonnect-frontend.vercel.app/login");
  });

  it("renders all inputs, buttons, and links", () => {
    cy.get("input#email").should("exist");
    cy.get("input#password").should("exist");
    cy.contains("button", "Log In").should("exist");
    cy.contains("Forgot password?").should("have.attr", "href", "/forgot-password");
    cy.contains("Sign Up").should("have.attr", "href", "/signup");
  });

  it("allows typing email and password", () => {
    cy.get("input#email").type("test@example.com").should("have.value", "test@example.com");
    cy.get("input#password").type("mypassword").should("have.value", "mypassword");
  });

  it("toggles password visibility", () => {
    cy.get("input#password").should("have.attr", "type", "password");
    cy.contains("button", "Show").click();
    cy.get("input#password").should("have.attr", "type", "text");
    cy.contains("button", "Hide").click();
    cy.get("input#password").should("have.attr", "type", "password");
  });

  context("form submission and redirects", () => {
   
    beforeEach(() => {
      cy.intercept("POST", "/api/login", (req) => {
        const { email, password } = req.body;
        if (email === "farmer@example.com" && password === "password") {
          req.reply({
            statusCode: 200,
            body: { user: { user_type: "Farmer" } },
          });
        } else if (email === "admin@example.com" && password === "password") {
          req.reply({
            statusCode: 200,
            body: { user: { user_type: "Admin" } },
          });
        } else {
          req.reply({
            statusCode: 401,
            body: { error: "Invalid credentials." },
          });
        }
      });
    });

    

    it("redirects to /users for Admin on successful login", () => {
      cy.get("input#email").type("admin@example.com");
      cy.get("input#password").type("password");
      cy.contains("button", "Log In").click();
      cy.url({ timeout: 10000 }).should("include", "/users");
    });

    it("shows error message on invalid credentials", () => {
      cy.get("input#email").type("wrong@example.com");
      cy.get("input#password").type("wrongpassword");
      cy.contains("button", "Log In").click();
      cy.get("p.text-red-600").should("contain.text", "Invalid credentials.");
    });

    

it("enables button and shows error for failed login", () => {
  cy.intercept("POST", "/api/login", {
    statusCode: 401,
    body: { error: "Invalid credentials." }
  }).as("postLoginFail");

  cy.get("input#email").type("wrong@example.com");
  cy.get("input#password").type("wrongpassword");
  cy.contains("button", "Log In").click();

  cy.wait("@postLoginFail");

  cy.get("button[type='submit']").should("not.be.disabled");

  cy.get("p.text-red-600").should("contain.text", "Invalid credentials.");
});

it("redirects to /dashboard for Farmer on successful login", () => {
      cy.get("input#email").type("farmer@example.com");
      cy.get("input#password").type("password");
      cy.contains("button", "Log In").click();
  
      cy.url({ timeout: 10000 }).should("include", "/dashboard");
    });


  });
});


