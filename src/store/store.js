import thunk from 'redux-thunk';
import { applyMiddleware, createStore } from 'redux';
 import { reducer } from "./reducers/index";

export default createStore(reducer, applyMiddleware(thunk));
