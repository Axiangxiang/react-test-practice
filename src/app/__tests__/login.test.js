import React from 'react';
import {
  fireEvent, render, screen,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { LoginPage } from '../LoginPage/LoginPage';
import '@testing-library/jest-dom';
import 'babel-polyfill';

describe('loginPage', () => {
  const initialState = { authentication: { } };
  const mockStore = configureStore();
  const store = mockStore(initialState);

  it('should show username validation message', async () => {
    // eslint-disable-next-line max-len
    const { getByTestId, findByText, getByLabelText } = render(<Provider store={store}><BrowserRouter><LoginPage /></BrowserRouter></Provider>);
    const username = getByLabelText('Username');
    const password = getByLabelText('Password');
    expect(username.value).toBe('');
    expect(password.value).toBe('');
    fireEvent.change(password, { target: { value: 'test' } });
    fireEvent.submit(getByTestId('form'));
    const result = screen.queryAllByText(/Password is required/);
    expect(result).toEqual([]);
    await findByText(/Username is required/);
  });

  it('should show password validation message', async () => {
    // eslint-disable-next-line max-len
    const { getByTestId, findByText, getByLabelText } = render(<Provider store={store}><BrowserRouter><LoginPage /></BrowserRouter></Provider>);
    const username = getByLabelText('Username');
    const password = getByLabelText('Password');
    expect(username.value).toBe('');
    expect(password.value).toBe('');
    fireEvent.change(username, { target: { value: 'test' } });
    fireEvent.submit(getByTestId('form'));
    const result = screen.queryAllByText(/Username is required/);
    expect(result).toEqual([]);
    await findByText(/Password is required/);
  });
});
