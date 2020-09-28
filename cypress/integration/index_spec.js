describe('Index page', () => {
  const testUser = {
    firstName: 'test', lastName: 'test', username: 'test', password: 'test',
  };
  beforeEach(() => {
    cy.visit('/');
    cy.get('input[name=username]').clear();
    cy.get('input[name=password]').clear();
    localStorage.clear();
    localStorage.setItem('users', JSON.stringify([{ ...testUser, id: 1 }]));
    cy.get('input[name=username]').type('test');
    cy.get('input[name=password]').type('test');
    cy.get('form').submit();
  });

  it('should visit the home page', () => {
    cy.contains('Logout');
    cy.get('ul li').its('length').should('be', 1);
    cy.get('li').should('contain', 'test test');
    cy.contains('Delete');
  });

  it('should delete user successfully', () => {
    cy.contains('Delete').click();
    cy.get('ul li').its('length').should('be', 0);
  });

  it('should logout successfully', () => {
    cy.contains('Logout').click();
    cy.url().should('include', '/login');
  });
});
