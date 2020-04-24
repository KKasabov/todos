import { createStore, applyMiddleware, Middleware } from 'redux';
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import reducer, { initialState } from './reducer';
import { AppActionType, RECORD_ACTION } from './types';


const persistConfig = {
    key: 'root',
    storage
}

// middleware for recording redux actions
const recordAction: Middleware = store => next => (action: AppActionType) => {
    const currentState = store.getState();
    if (currentState.isRecording && action.type.includes('TODO')) {
        store.dispatch({
            type: RECORD_ACTION,
            payload: action
        })
    }

    next(action);
}

export const store = createStore(
    persistReducer(persistConfig, reducer),
    composeWithDevTools(applyMiddleware(thunkMiddleware, recordAction))
);

export const persistor = persistStore(store);
