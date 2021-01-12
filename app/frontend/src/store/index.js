import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import reducer from './reducer';

export default function configureStore() {
    let store = createStore(reducer, applyMiddleware(thunk, logger));
    return store;
}
