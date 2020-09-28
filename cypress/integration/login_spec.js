describe('Login page', () => {
  const testUser = {
    firstName: 'test', lastName: 'test', username: 'test', password: 'test',
  };
  beforeEach(() => {
    cy.visit('/');
    cy.get('input[name=username]').clear();
    cy.get('input[name=password]').clear();
    localStorage.clear();
    localStorage.setItem('users', JSON.stringify([{ ...testUser, id: 1 }]));
  });

  it('should visit the login page', () => {
    cy.url().should('include', '/login');
  });

  it('should visit the register page', () => {
    cy.contains('Register').click();
    cy.url().should('include', '/register');
  });

  it('should successfully login when click the login button', () => {
    cy.get('input[name=username]').type(testUser.username);
    cy.get('input[name=password]').type(testUser.password);
    cy.get('form').submit();
    cy.url().should('include', '/');
    cy.contains('Logout');
  });

  it('should login unsuccessfully when user not register', () => {
    cy.get('input[name=username]').type('test1');
    cy.get('input[name=password]').type('test1');
    cy.get('form').submit();
    cy.url().should('include', '/login');
    cy.get('.alert').should('contain', 'Username or password is incorrect');
  });

  it('should login unsuccessfully when password not correct', () => {
    localStorage.setItem('users', JSON.stringify([testUser]));
    cy.get('input[name=username]').type('test');
    cy.get('input[name=password]').type('test12');
    cy.get('form').submit();
    cy.url().should('include', '/login');
    cy.get('.alert').should('contain', 'Username or password is incorrect');
  });
});
