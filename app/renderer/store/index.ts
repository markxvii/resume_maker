// @ts-ignore
import logger from 'redux-logger';
// @ts-ignore
import RcReduxModel from 'rc-redux-model';
import { createStore, applyMiddleware, combineReducers } from 'redux';
// @ts-ignore
import globalModel from './globalModel';

const reduxModel = new RcReduxModel([globalModel]);

const reducerList = combineReducers(reduxModel.reducers);

export default createStore(reducerList, applyMiddleware(reduxModel.thunk, logger));
