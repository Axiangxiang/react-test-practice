import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';

import { App } from './app/App';
import { store, configureFakeBackend } from './app/_helpers';

configureFakeBackend();

ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root'),
);
