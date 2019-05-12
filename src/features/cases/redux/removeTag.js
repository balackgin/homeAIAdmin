import { delay, takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import {
  CASES_REMOVE_TAG_BEGIN,
  CASES_REMOVE_TAG_SUCCESS,
  CASES_REMOVE_TAG_FAILURE,
  CASES_REMOVE_TAG_DISMISS_ERROR,
} from './constants';

export function removeTag() {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: CASES_REMOVE_TAG_BEGIN,
  };
}

export function dismissRemoveTagError() {
  return {
    type: CASES_REMOVE_TAG_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on CASES_REMOVE_TAG_BEGIN actions
export function* doRemoveTag() {
  // If necessary, use argument to receive the begin action with parameters.
  let res;
  try {
    // Do Ajax call or other async request here. delay(20) is just a placeholder.
    res = yield call(delay, 20);
  } catch (err) {
    yield put({
      type: CASES_REMOVE_TAG_FAILURE,
      data: { error: err },
    });
    return;
  }
  // Dispatch success action out of try/catch so that render errors are not catched.
  yield put({
    type: CASES_REMOVE_TAG_SUCCESS,
    data: res,
  });
}

/*
  Alternatively you may use takeEvery.

  takeLatest does not allow concurrent requests. If an action gets
  dispatched while another is already pending, that pending one is cancelled
  and only the latest one will be run.
*/
export function* watchRemoveTag() {
  yield takeLatest(CASES_REMOVE_TAG_BEGIN, doRemoveTag);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case CASES_REMOVE_TAG_BEGIN:
      return {
        ...state,
        removeTagPending: true,
        removeTagError: null,
      };

    case CASES_REMOVE_TAG_SUCCESS:
      return {
        ...state,
        removeTagPending: false,
        removeTagError: null,
      };

    case CASES_REMOVE_TAG_FAILURE:
      return {
        ...state,
        removeTagPending: false,
        removeTagError: action.data.error,
      };

    case CASES_REMOVE_TAG_DISMISS_ERROR:
      return {
        ...state,
        removeTagError: null,
      };

    default:
      return state;
  }
}
