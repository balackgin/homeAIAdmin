import { takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { servicesWithSpin } from '../service';
import {
  CASES_ADD_TAG_BEGIN,
  CASES_ADD_TAG_SUCCESS,
  CASES_ADD_TAG_FAILURE,
  CASES_ADD_TAG_DISMISS_ERROR,
} from './constants';

export function addTag(payload) {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: CASES_ADD_TAG_BEGIN,
    payload,
  };
}

export function dismissAddTagError() {
  return {
    type: CASES_ADD_TAG_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on CASES_ADD_TAG_BEGIN actions
export function* doAddTag(action) {
  // If necessary, use argument to receive the begin action with parameters.
  let res;
  try {
    res = yield call(servicesWithSpin.asyncAddTag, action.payload)
  } catch (err) {
    yield put({
      type: CASES_ADD_TAG_FAILURE,
      data: { error: err },
    });
    return;
  }
  // Dispatch success action out of try/catch so that render errors are not catched.
  yield put({
    type: CASES_ADD_TAG_SUCCESS,
    data: res,
  });
}

/*
  Alternatively you may use takeEvery.

  takeLatest does not allow concurrent requests. If an action gets
  dispatched while another is already pending, that pending one is cancelled
  and only the latest one will be run.
*/
export function* watchAddTag() {
  yield takeLatest(CASES_ADD_TAG_BEGIN, doAddTag);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case CASES_ADD_TAG_BEGIN:
      return {
        ...state,
        addTagPending: true,
        addTagError: null,
      };

    case CASES_ADD_TAG_SUCCESS:
      return {
        ...state,
        addTagPending: false,
        addTagError: null,
      };

    case CASES_ADD_TAG_FAILURE:
      return {
        ...state,
        addTagPending: false,
        addTagError: action.data.error,
      };

    case CASES_ADD_TAG_DISMISS_ERROR:
      return {
        ...state,
        addTagError: null,
      };

    default:
      return state;
  }
}
