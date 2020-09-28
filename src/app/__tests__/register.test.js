import React from 'react';
import { fireEvent, render, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';
import { RegisterPage } from '../RegisterPage/RegisterPage';
import { registration } from '../_reducers/registration.reducer';
import '@testing-library/jest-dom';

const renderWithRedux = (
  ui,
  {
    initialState = {},
    store = createStore(registration, initialState, applyMiddleware(thunkMiddleware)),
  } = {},
) => ({
  ...render(<Provider store={store}><BrowserRouter>{ui}</BrowserRouter></Provider>),
  store,
});

describe('login', () => {
  const mockRegister = jest.fn();
  jest.mock('../_actions/user.action.js', () => ({
    register: mockRegister,
  }));

  const component = renderWithRedux(<RegisterPage />, {
    initialState: {
      registration: {
        registering: true,
      },
    },
  });

  afterEach(() => {
    cleanup();
  });

  it('should register successfully', () => {
    const { getByLabelText, getByTestId } = component;
    const firstName = getByLabelText('First Name');
    const lastName = getByLabelText('Last Name');
    const username = getByLabelText('Username');
    const password = getByLabelText('Password');
    expect(firstName.value).toBe('');
    expect(lastName.value).toBe('');
    expect(username.value).toBe('');
    expect(password.value).toBe('');
    fireEvent.change(firstName, { target: { value: 'test' } });
    fireEvent.change(lastName, { target: { value: 'test' } });
    fireEvent.change(username, { target: { value: 'test' } });
    fireEvent.change(password, { target: { value: 'test' } });
    expect(firstName.value).toBe('test');
    expect(lastName.value).toBe('test');
    expect(username.value).toBe('test');
    expect(password.value).toBe('test');
    fireEvent.submit(getByTestId('form'));
    expect(mockRegister).toHaveBeenCalledTimes(1);
  });

  it('should register fail when firstName or lastName or username or password is empty', () => {
    const { getByTestId, getByText, getByLabelText } = component;
    const firstName = getByLabelText('First Name');
    const lastName = getByLabelText('Last Name');
    const username = getByLabelText('Username');
    const password = getByLabelText('Password');
    expect(firstName.value).toBe('');
    expect(lastName.value).toBe('');
    expect(username.value).toBe('');
    expect(password.value).toBe('');
    fireEvent.submit(getByTestId('form'));
    expect(getByText(/First Name is required/i)).toBeTruthy();
    expect(getByText(/Last Name is required/i)).toBeTruthy();
    expect(getByText(/Username is required/i)).toBeTruthy();
    expect(getByText(/Password is required/i)).toBeTruthy();
    expect(mockRegister).not.toBeCalled();
  });
});
