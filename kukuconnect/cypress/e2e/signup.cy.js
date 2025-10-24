describe('Sign Up Page', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/signup').as('registerRequest');
    cy.visit('https://kukukonnect-frontend.vercel.app/signup');
  });

  it('renders all form fields and buttons', () => {
    cy.get('input#firstName').should('exist').and('be.visible');
    cy.get('input#lastName').should('exist').and('be.visible');
    cy.get('input#username').should('exist').and('be.visible');
    cy.get('input#email').should('exist').and('be.visible');
    cy.get('input#phone').should('exist').and('be.visible');
    cy.get('input#password').should('exist').and('be.visible');
    cy.get('input#confirm').should('exist').and('be.visible');
    cy.get('button[type="submit"]').should('exist').and('be.visible');
  });

  it('toggles password visibility for password and confirm inputs independently', () => {
    
    cy.get('button[aria-label="Show password"]').first().should('be.visible').click();
    cy.get('input#password').should('have.attr', 'type', 'text');
    cy.get('button[aria-label="Hide password"]').first().should('be.visible').click();
    cy.get('input#password').should('have.attr', 'type', 'password');

   
    cy.get('input#confirm').parent().within(() => {
      cy.get('button[aria-label="Show password"]').should('be.visible').click();
      cy.get('input#confirm').should('have.attr', 'type', 'text');
      cy.get('button[aria-label="Hide password"]').should('be.visible').click();
      cy.get('input#confirm').should('have.attr', 'type', 'password');
    });
  });

  it('shows error if passwords do not match', () => {
    cy.get('input#password').type('password123');
    cy.get('input#confirm').type('password456');
    cy.get('button[type="submit"]').click();
    cy.contains('Passwords do not match.').should('be.visible');
  });

  it('submits form successfully with valid data', () => {
    cy.intercept('POST', '/api/signup', {
      statusCode: 201,
      body: { message: 'Account created successfully.' },
    }).as('registerSuccess');

    cy.get('input#firstName').type('Test');
    cy.get('input#lastName').type('User');
    cy.get('input#username').type('testuser');
    cy.get('input#email').type('testuser@example.com');
    cy.get('input#phone').type('1234567890');
    cy.get('input#password').type('Password123!');
    cy.get('input#confirm').type('Password123!');

    cy.get('button[type="submit"]').click();

    cy.wait('@registerSuccess', { timeout: 10000 });
    cy.contains('Account created successfully.').should('be.visible');
  });

  it('displays error message on server error response', () => {
   
    cy.intercept('POST', '/api/signup', {
      statusCode: 400,
      body: { message: 'Email already exists' },
    }).as('registerFail');

 
    cy.visit('https://kukukonnect-frontend.vercel.app/signup');

    cy.get('input#firstName').type('Test');
    cy.get('input#lastName').type('User');
    cy.get('input#username').type('testuser');
    cy.get('input#email').type('testuser@example.com');
    cy.get('input#phone').type('1234567890');
    cy.get('input#password').type('Password123!');
    cy.get('input#confirm').type('Password123!');

    cy.get('button[type="submit"]').click();

    cy.wait('@registerFail', { timeout: 10000 });

    cy.get('p.text-sm.font-medium.text-red-600', { timeout: 10000 }).should(
      'contain.text',
      'Email already exists'
    );
  });
});
