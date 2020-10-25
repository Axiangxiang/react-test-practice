import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from '../HomePage/HomePage';
import '@testing-library/jest-dom';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import fetch from 'node-fetch';

describe('homePage', () => {
  global.fetch = fetch;
  const testUser = {
    id: 1, firstName: 'test', lastName: 'test', username: 'test', password: 'test',
  };

  const initialState = { authentication: { user: testUser }, users: { items: [testUser] } };
  const middlewares = [thunk]; // add your middlewares like `redux-thunk`
  const mockStore = configureStore(middlewares);
  let store;

  it('should get all user successfully', () => {
    store = mockStore(initialState);
    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </Provider>,
    );
    expect(getByText(/test test/i)).toBeTruthy();
  });

  it('should delete user successfully', () => {
    store = mockStore(initialState);
    const deleteUser = jest.fn();
    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <HomePage deleteUser={deleteUser} />
        </BrowserRouter>
      </Provider>,
    );
    fireEvent.click(getByText('Delete'));
    const deleteAction = store.getActions().filter((action) => action.type === 'USERS_DELETE_REQUEST')[0];
    expect(deleteAction.id).toEqual(testUser.id);
  });
});
