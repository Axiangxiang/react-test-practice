import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import 'babel-polyfill';
import thunk from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';
import fetch from 'node-fetch';
import { RegisterPage } from '../RegisterPage';

describe('RegisterPage', () => {
  global.fetch = fetch;
  const initialState = { registration: { } };
  const middlewares = [thunk]; // add your middlewares like `redux-thunk`
  const mockStore = configureStore(middlewares);
  let store;

  test('should register successfully', async () => {
    store = mockStore(initialState);
    const register = jest.fn();
    const { getByTestId } = render(
      <Provider store={store}>
        <BrowserRouter>
          <RegisterPage register={register} />
        </BrowserRouter>
      </Provider>,
    );

    fireEvent.change(getByTestId('firstName'), { target: { value: 'a' } });
    fireEvent.change(getByTestId('lastName'), { target: { value: 'b' } });
    fireEvent.change(getByTestId('username'), { target: { value: 'c' } });
    fireEvent.change(getByTestId('password'), { target: { value: 'd' } });

    fireEvent.click(getByTestId('register'), 'submit');

    const registerAction = store.getActions().filter((action) => action.type === 'USERS_REGISTER_REQUEST')[0];

    expect(registerAction.user).toEqual({
      firstName: 'a', lastName: 'b', username: 'c', password: 'd',
    });
  });

  it('should register fail when firstName or lastName or username or password is empty', () => {
    store = mockStore(initialState);
    const register = jest.fn();
    // eslint-disable-next-line max-len
    const { getByTestId, getByText } = render(<Provider store={store}><BrowserRouter><RegisterPage register={register} /></BrowserRouter></Provider>);
    const firstName = getByTestId('firstName');
    const lastName = getByTestId('lastName');
    const username = getByTestId('username');
    const password = getByTestId('password');
    expect(firstName.value).toBe('');
    expect(lastName.value).toBe('');
    expect(username.value).toBe('');
    expect(password.value).toBe('');
    fireEvent.click(getByTestId('register'), 'submit');
    expect(getByText(/First Name is required/i)).toBeTruthy();
    expect(getByText(/Last Name is required/i)).toBeTruthy();
    expect(getByText(/Username is required/i)).toBeTruthy();
    expect(getByText(/Password is required/i)).toBeTruthy();
  });
});
