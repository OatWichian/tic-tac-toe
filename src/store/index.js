import createSagaMiddleware from "redux-saga";
// import { createWrapper } from 'next-redux-wrapper';
import { createStore, applyMiddleware, compose } from "redux";
import { persistStore } from "redux-persist";
import { combineReducers } from "redux";

import rootSaga from "./sagas";
import commonReducer from "./reducers/index";
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const rootReducer = combineReducers({
  ...commonReducer
});

export const makeStore = (context) => {
  // 1: Create the middleware
  const sagaMiddleware = createSagaMiddleware();

  // 2: Make exception for redux dev tools
  const composeEnhancers = (typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

  // 3: Custom option middleware
  const customMiddleware = process.env.NODE_ENV == 'development' ? composeEnhancers(applyMiddleware(sagaMiddleware)) : applyMiddleware(sagaMiddleware)
  // const customMiddleware = composeEnhancers(applyMiddleware(sagaMiddleware));

  // 4: Add an extra parameter for applying middleware:
  const store = createStore(rootReducer, customMiddleware);

  // 5: Add on persist
  if (publicRuntimeConfig.config.reduxPersist) {
    store.__persistor = persistStore(store);
  }

  // 6: Run your sagas on server
  store.sagaTask = sagaMiddleware.run(rootSaga);

  // // 7: store gobal:
  // window.store = store
  // 8: now return the store:
  return store;
};

export const wrapper = makeStore;
