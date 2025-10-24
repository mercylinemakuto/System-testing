describe('Farmers Page', () => {
  beforeEach(() => {
   
    cy.intercept('POST', '/api/users').as('addFarmer');
    cy.intercept('POST', '/api/users').as('addFarmerFail');
    cy.intercept('POST', '/api/users').as('addFarmerLoading');

    cy.visit('https://kukukonnect-frontend.vercel.app/users');
  });

  it('renders search input and Add Farmer button', () => {
    cy.get('input[placeholder*="Search"]').should('be.visible');
    cy.contains('Add Farmer').should('be.visible');
  });

  it('opens AddUserModal when Add Farmer button clicked', () => {
    cy.contains('Add Farmer').click();
    cy.get('form').within(() => {
      cy.contains('Add New Farmer').should('be.visible');
      cy.get('button[aria-label="Close modal"]').should('exist');
    });
  });

  it('allows entering farmer details and submitting the form', () => {
   
    cy.intercept('POST', '/api/users', {
      statusCode: 201,
      body: {},
    }).as('addFarmerSuccess');

    cy.contains('Add Farmer').click();
    cy.get('form').within(() => {
      cy.get('input[name="first_name"]').type('John');
      cy.get('input[name="last_name"]').type('Doe');
      cy.get('input[name="email"]').type('john.doe@example.com');
      cy.get('input[name="phone_number"]').type('1234567890');
      cy.get('input[name="username"]').type('johndoe');
      cy.get('input[name="device_id"]').type('device123');
      cy.get('button[type="submit"]').click();
    });

   
    cy.wait('@addFarmerSuccess', { timeout: 15000 });

  
    cy.get('form').should('not.exist');
    cy.contains('Farmer added successfully!').should('be.visible');
  });

  it('displays error message when add farmer API fails', () => {
  
    cy.intercept('POST', '/api/users', {
      statusCode: 400,
      body: { message: 'Failed to add farmer' },
    }).as('addFarmerFailure');

    cy.contains('Add Farmer').click();
    cy.get('form').within(() => {
      cy.get('input[name="first_name"]').type('John');
      cy.get('input[name="last_name"]').type('Doe');
      cy.get('input[name="email"]').type('john.doe@example.com');
      cy.get('input[name="phone_number"]').type('1234567890');
      cy.get('input[name="username"]').type('johndoe');
      cy.get('input[name="device_id"]').type('device123');
      cy.get('button[type="submit"]').click();
    });

    cy.wait('@addFarmerFailure', { timeout: 15000 });
    cy.contains('Failed to add farmer').should('be.visible');
  });

  it('closes AddUserModal when Cancel or Close button clicked', () => {
    cy.contains('Add Farmer').click();
    cy.get('form').within(() => {
      cy.contains('Cancel').click();
    });
    cy.get('form').should('not.exist');

    cy.contains('Add Farmer').click();
    cy.get('button[aria-label="Close modal"]').click();
    cy.get('form').should('not.exist');
  });

  it('displays loading text on submit button while adding', () => {
    
    cy.intercept('POST', '/api/users', {
      statusCode: 201,
      delay: 1000,
      body: {},
    }).as('addFarmerLoadingDelayed');

    cy.contains('Add Farmer').click();
    cy.get('form').within(() => {
      cy.get('input[name="first_name"]').type('Jane');
      cy.get('input[name="last_name"]').type('Smith');
      cy.get('input[name="email"]').type('jane.smith@example.com');
      cy.get('input[name="phone_number"]').type('0987654321');
      cy.get('input[name="username"]').type('janesmith');
      cy.get('input[name="device_id"]').type('device456');
      cy.get('button[type="submit"]').should('contain.text', 'Add Farmer').click();
      cy.get('button[type="submit"]').should('contain.text', 'Adding...');
    });

    cy.wait('@addFarmerLoadingDelayed', { timeout: 15000 });
  });
});
