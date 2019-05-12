import * as baseSagas from './sagas';
import * as commonSagas from '../features/common/redux/sagas';
import * as homeSagas from '../features/home/redux/sagas';
import * as projectSagas from '../features/project/redux/sagas';
import * as casesSagas from '../features/cases/redux/sagas';
import * as signupSagas from '../features/signup/redux/sagas';
import * as messagesSagas from '../features/messages/redux/sagas';
import * as contributionSagas from '../features/contribution/redux/sagas';
import * as settingsSagas from '../features/settings/redux/sagas';
import * as samplesSagas from '../features/samples/redux/sagas';
import * as operatorSagas from '../features/operator/redux/sagas';
import * as sampleCheckSagas from '../features/sample-check/redux/sagas';

// This file is auto maintained by rekit-plugin-redux-saga,
// you usually don't need to manually edit it.

// NOTE: DO NOT chanage featureSagas declearation pattern, it's used by rekit-plugin-redux-saga.
const featureSagas = [
  commonSagas,
  homeSagas,
  projectSagas,
  casesSagas,
  signupSagas,
  messagesSagas,
  contributionSagas,
  settingsSagas,
  samplesSagas,
  operatorSagas,
  sampleCheckSagas
];

// 扩展rekit, 处理通用的spin和error
featureSagas.push(baseSagas);

const sagas = featureSagas.reduce((prev, curr) => [
  ...prev,
  ...Object.keys(curr).map(k => curr[k]),
], [])
// a saga should be function, below filter avoids error if redux/sagas.js is empty;
.filter(s => typeof s === 'function');

function* rootSaga() {
  yield sagas.map(saga => saga());
}

export default rootSaga;
