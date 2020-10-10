import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { RegisterPage } from '../RegisterPage/RegisterPage';
import '@testing-library/jest-dom';
import '../_actions/user.actions';

describe('registerPage', () => {
  const initialState = { registration: { } };
  const middlewares = [thunk];
  const mockStore = configureStore(middlewares);
  const store = mockStore(initialState);

  it('should register successfully', () => {
    const register = jest.fn();
    const { getByLabelText, getByTestId } = render(<Provider store={store}><BrowserRouter><RegisterPage register={register} /></BrowserRouter></Provider>);
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

    const registerAction = store.getActions().filter((action) => action.type === 'USERS_REGISTER_REQUEST')[0];
    expect(registerAction.user).toEqual({
      firstName: 'test', lastName: 'test', username: 'test', password: 'test',
    });
  });

  it('should register fail when firstName or lastName or username or password is empty', () => {
    const { getByTestId, getByText, getByLabelText } = render(<Provider store={store}><BrowserRouter><RegisterPage register={register} /></BrowserRouter></Provider>);
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
    expect(fetch).not.toBeCalled();
  });
});

describe('RegisterPage', () => {
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
});
