import { fork } from 'redux-saga/effects';
import message from './message';
import error from './error';
import spin from './spin';

export default function* baseSaga() {
  yield [
    fork(message),
    fork(error),
    fork(spin),
  ];
}
