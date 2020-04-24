import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import App from './App';
import { store, persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';

const mountNode = document.getElementById("app");
render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>,
    mountNode
);