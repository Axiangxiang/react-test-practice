import React from 'react';
import { fireEvent, render, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from '../LoginPage/LoginPage';
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
    firstName: 'test', lastName: 'test', username: 'test', password: 'test',
  };

  const mockLogin = jest.fn();
  const mockGetAll = jest.fn();
  jest.mock('../_actions/user.action.js', () => ({
    login: mockLogin,
    getAll: mockGetAll,
  }));

  const component = renderWithRedux(<LoginPage />, {
    initialState: {
      authentication: {
        loggingIn: false,
        user: {},
      },
    },
  });

  afterEach(() => {
    cleanup();
  });

  it('should login successfully', () => {
    const { getByLabelText, getByTestId } = component;
    const username = getByLabelText('Username');
    const password = getByLabelText('Password');
    expect(username.value).toBe('');
    expect(password.value).toBe('');
    fireEvent.change(username, { target: { value: 'test' } });
    fireEvent.change(password, { target: { value: 'test' } });
    expect(username.value).toBe('test');
    expect(password.value).toBe('test');
    fireEvent.submit(getByTestId('form'));
    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockGetAll).toHaveBeenCalledTimes(1);
  });

  it('should login fail when username or password is empty', () => {
    const { getByTestId, getByText, getByLabelText } = component;
    const username = getByLabelText('Username');
    const password = getByLabelText('Password');
    expect(username.value).toBe('');
    expect(password.value).toBe('');
    fireEvent.submit(getByTestId('form'));
    expect(getByText(/Username is required/i)).toBeTruthy();
    expect(getByText(/Password is required/i)).toBeTruthy();
    expect(mockLogin).not.toBeCalled();
  });
});
