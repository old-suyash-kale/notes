import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import promise from 'redux-promise';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';

import reducers from './reducers/index';

const middleware = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose)(applyMiddleware(promise, thunk, routerMiddleware(createBrowserHistory())));

export default createStore(reducers, middleware);