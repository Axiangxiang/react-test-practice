import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from '../HomePage/HomePage';
import { authentication } from '../_reducers/authentication.reducer';
import '@testing-library/jest-dom';
import config from 'config';

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

describe('homePage', () => {
  const testUser = {
    id: 1, firstName: 'test', lastName: 'test', username: 'test', password: 'test',
  };

  // const mockDelete = jest.fn();
  // const mockGetAll = jest.fn();
  jest.mock('../_actions/user.action.js', () => ({
    // delete: mockDelete,
    // getAll: mockGetAll,
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
    fetch.mockClear();
  });

  it('should get all user successfully', () => {
    const { getByText } = component;
    global.fetch = jest.fn(() => Promise.resolve(
      {
        ok: true,
        text: jest.fn(() => Promise.resolve([{
          ...testUser,
          id: 1,
        }])),
      },
    ));
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${config.apiUrl}/users/`);
    expect(getByText(/test test/i)).toBeTruthy();
  });

  it('should delete user successfully', () => {
    const { getByText } = component;
    global.fetch = jest.fn(() => Promise.resolve(
      {
        ok: true,
        text: jest.fn(() => Promise.resolve([{
          ...testUser,
          id: 1,
        }])),
      },
    ));
    expect(getByText(/test test/i)).toBeTruthy();
    fetch.mockClear();
    global.fetch = jest.fn(() => Promise.resolve(
      {
        ok: true,
      },
    ));
    const deleteBtn = getByText('Delete');
    deleteBtn.click();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${config.apiUrl}/users/${testUser.id}`);
    expect(getByText(/test test/i)).toBeFalsy();
  });
});
