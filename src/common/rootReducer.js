import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import app from './reducers/app';
import user from './reducers/user';
import homeReducer from '../features/home/redux/reducer';
import commonReducer from '../features/common/redux/reducer';
import projectReducer from '../features/project/redux/reducer';
import casesReducer from '../features/cases/redux/reducer';
import operatorReducer from '../features/operator/redux/reducer';
import signupReducer from '../features/signup/redux/reducer';
import contributionReducer from '../features/contribution/redux/reducer';
import messagesReducer from '../features/messages/redux/reducer';
import settingsReducer from '../features/settings/redux/reducer';
import samplesReducer from '../features/samples/redux/reducer';
import sampleCheckReducer from '../features/sample-check/redux/reducer';

// NOTE 1: DO NOT CHANGE the 'reducerMap' name and the declaration pattern.
// This is used for Rekit cmds to register new features, remove features, etc.
// NOTE 2: always use the camel case of the feature folder name as the store branch name
// So that it's easy for others to understand it and Rekit could manage theme.

const reducerMap = {
  router: routerReducer,
  home: homeReducer,
  common: commonReducer,
  operator: operatorReducer,
  project: projectReducer,
  cases: casesReducer,
  signup: signupReducer,
  messages: messagesReducer,
  contribution: contributionReducer,
  settings: settingsReducer,
  samples: samplesReducer,
  sampleCheck: sampleCheckReducer,
};

// 扩展rekit, 处理通用的spin和error; 以及user/role信息
reducerMap['app'] = app;
reducerMap['user'] = user;

export default combineReducers(reducerMap);
