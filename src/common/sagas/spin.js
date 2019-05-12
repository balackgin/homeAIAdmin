import { delay } from 'redux-saga';
import { race, call, takeEvery, put, take } from 'redux-saga/effects';

export default function* spin() {
  yield takeEvery('PREPARE_REQUEST', function* handleSpin() {
    const res = yield race({
      stop: take('REQUEST_FINISH'),
      timeout: call(delay, 200),
    });
    if (res.timeout) {
      yield put({
        type: 'SPIN',
      });
      yield take('REQUEST_FINISH');
      yield put({
        type: 'UNSPIN',
      });
    }
  });
}
