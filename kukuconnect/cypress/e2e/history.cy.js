describe("History Page E2E & Component Tests", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/history", {
      body: [
        { timestamp: "2025-10-20T12:00:00Z", temperature: 25, humidity: 60 },
        { timestamp: "2025-10-21T12:00:00Z", temperature: 28, humidity: 65 },
        { timestamp: "2025-10-22T12:00:00Z", temperature: 26, humidity: 63 },
        
      ],
    }).as("getHistory");
  });

  it("loads history page and displays header and graph view by default", () => {
    cy.visit("https://kukukonnect-frontend.vercel.app/history");
    cy.wait("@getHistory");
    cy.contains("Temperature and Humidity History").should("be.visible");
    cy.get("button").contains("Graph").should("have.class", "bg-[#D2914A]");
    cy.get("button").contains("List").should("not.have.class", "bg-[#D2914A]");
    cy.get("svg").should("exist");
    cy.get("rect").should("have.length.greaterThan", 0);
  });

  

  it("toggles view to List and displays paginated table", () => {
  cy.visit("https://kukukonnect-frontend.vercel.app/history");
  cy.wait("@getHistory");
  cy.get("button").contains("List").click();
  cy.get("table").should("exist");
  cy.get("tbody tr").should("have.length.at.most", 6);
  cy.contains("Page 1 of").should("exist");


  cy.get("button").contains("Next").then($btn => {
    if (!$btn.is(":disabled")) {
      cy.wrap($btn).click();
      cy.contains("Page 2 of").should("exist");
    } else {
      cy.log("Next button is disabled, no further pages to navigate");
    }
  });
});


  it("displays loading and error states", () => {
    cy.intercept("GET", "/api/history", (req) => {
      req.reply((res) => {
      
        res.send([]);
      });
    });
    cy.visit("https://kukukonnect-frontend.vercel.app/history");
    cy.contains("Loading data...").should("be.visible");

    cy.intercept("GET", "/api/history", { statusCode: 500, body: "Internal Server Error" });
    cy.visit("https://kukukonnect-frontend.vercel.app/history");
    cy.contains("Error").should("be.visible");
  });

  it("allows date picker selection to filter data", () => {
    cy.visit("https://kukukonnect-frontend.vercel.app/history");
    cy.wait("@getHistory");
    cy.get('input[placeholder="Select date"]').click();
    cy.get(".react-datepicker__day--020").click();
  
  });
});