import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import rootReducer from "./rootReducer";
import throttle from "lodash/throttle";
import { loadState, setLocalState } from "./localStorage";

const initialState = loadState();

const middleware =
  process.env.NODE_ENV === "production"
    ? applyMiddleware(thunk)
    : compose(
        applyMiddleware(thunk, logger),
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
          window.__REDUX_DEVTOOLS_EXTENSION__()
      );

const store = createStore(rootReducer, initialState, middleware);

store.subscribe(
  throttle(() => {
    setLocalState(store.getState());
  }, 1000)
);

export default store;
