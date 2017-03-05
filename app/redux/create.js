import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducer from './modules/reducer';

const middlewares = [thunkMiddleware];

if (process.env.NODE_ENV == "development") {
  const createLogger = require('redux-logger');
  const loggerMiddleware = createLogger();
  middlewares.push(loggerMiddleware);
}

export default function createAppStore() {
  return createStore(reducer, applyMiddleware(...middlewares));
}
