// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('addUser', (firstName, lastName, username, password) => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const newUser = {
    firstName, lastName, username, password,
  };
  newUser.id = users.length ? Math.max(...users.map((user) => user.id)) + 1 : 1;
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
});
