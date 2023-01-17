// app/renderer/store/index.ts
// @ts-ignore
import logger from 'redux-logger';
// @ts-ignore
import RcReduxModel from 'rc-redux-model';
import { createStore, applyMiddleware, combineReducers } from 'redux';

// 引入写好的 model
import globalModel from './globalModel';
import resumeModel from './resumeModel';
import templateModel from './templateModel';

// 这里需要调用 RcReduxModel 实例化一下得到最后的 reduxModel
const reduxModel = new RcReduxModel([globalModel, resumeModel, templateModel]);

// 无侵入式的使用 Redux，即使写最原始的 reducer 也照样支持
const reducerList = combineReducers(reduxModel.reducers);

export default createStore(reducerList, applyMiddleware(reduxModel.thunk, logger));
