import React from 'react';
import { fireEvent, render, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from '../HomePage/HomePage';
import { authentication } from '../_reducers/authentication.reducer';
import '@testing-library/jest-dom';

const renderWithRedux = (
  ui,
  {
    initialState = {},
    store = createStore(authentication, initialState, applyMiddleware(thunkMiddleware)),
  } = {},
) => ({
  ...render(<Provider store={store}><BrowserRouter>{ui}</BrowserRouter></Provider>),
  store,
});

describe('login', () => {
  const testUser = {
    id: 1, firstName: 'test', lastName: 'test', username: 'test', password: 'test',
  };

  const mockDelete = jest.fn();
  const mockGetAll = jest.fn();
  jest.mock('../_actions/user.action.js', () => ({
    delete: mockDelete,
    getAll: mockGetAll,
  }));

  const component = renderWithRedux(<HomePage />, {
    initialState: {
      authentication: {
        loggedIn: true,
        user: testUser,
      },
    },
  });

  afterEach(() => {
    cleanup();
  });

  it('should get all user successfully', () => {
    expect(mockGetAll).toHaveBeenCalledTimes(1);
  });

  it('should delete user successfully', () => {
    const { getByText } = component;
    const deleteBtn = getByText('Delete');
    deleteBtn.click();
    expect(mockDelete).toHaveBeenCalledTimes(1);
  });
});
