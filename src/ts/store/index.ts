import { createStore, applyMiddleware, Middleware } from 'redux';
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer, { initialState } from './reducer';
import { AppActionType, RECORD_ACTION, PLAY_RECORDING, TodoActionType } from './types';

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

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware, recordAction))
);

export default store;