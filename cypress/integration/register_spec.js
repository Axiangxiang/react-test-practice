describe('Register page', () => {
  const testUser = {
    firstName: 'test', lastName: 'test', username: 'test', password: 'test',
  };

  function setInputValue(user) {
    cy.get('input[name=firstName]').type(user.firstName).should('have.value', user.firstName);
    cy.get('input[name=lastName]').type(user.lastName).should('have.value', user.lastName);
    cy.get('input[name=username]').type(user.username).should('have.value', user.username);
    cy.get('input[name=password]').type(user.password).should('have.value', user.password);
  }

  beforeEach(() => {
    cy.visit('/register');
    cy.get('input[name=firstName]').clear();
    cy.get('input[name=lastName]').clear();
    cy.get('input[name=username]').clear();
    cy.get('input[name=password]').clear();
    localStorage.removeItem('users');
    localStorage.setItem('users', JSON.stringify([{ ...testUser, id: 1 }]));
  });

  it('should successfully register user', () => {
    setInputValue({ ...testUser, username: 'test2' });
    cy.get('form').submit();
    cy.url().should('include', '/login');
    cy.get('.alert').should('contain', 'Registration successful');
  });

  it('should unsuccessfully register user when user exist', () => {
    // cy.addUser(testUser.firstName, testUser.lastName, testUser.username, testUser.password);
    setInputValue(testUser);
    cy.get('form').submit();
    cy.url().should('include', '/register');
    cy.get('.alert').should('contain', `Username "${testUser.username}" is already taken`);
  });

  it('should successfully cancel register', () => {
    setInputValue(testUser);
    cy.contains('Cancel').click();
    cy.url().should('include', '/login');
  });
});
