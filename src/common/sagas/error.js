import { delay } from 'redux-saga';
import { takeLatest, put, call } from 'redux-saga/effects';

function* handleError(action) {
  yield call(delay, 500);
  yield put({
    type: 'ERROR',
    payload: {
      error: action.payload.error,
    },
  });
}

export default function* error() {
  yield takeLatest('REQUEST_ERROR', handleError);
}
