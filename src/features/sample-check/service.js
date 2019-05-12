import {
  doSampleCheck
} from './api';
import { delay } from 'redux-saga';
import { spinWrapper } from '../../common/core/wrapper';

export async function asyncDoSampleCheck(id, actionType, reason) {
  await doSampleCheck(id, actionType, reason);
  await delay(500);
}

export const servicesWithSpin = {
  asyncDoSampleCheck: spinWrapper(asyncDoSampleCheck)
};
