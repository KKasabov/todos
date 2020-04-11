import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import App from './App';
import store from './store';

const mountNode = document.getElementById("app");
render(
    <Provider store={store}>
        <App />
    </Provider>,
    mountNode);