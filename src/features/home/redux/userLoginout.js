import { takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import {
  HOME_USER_LOGINOUT_BEGIN,
  HOME_USER_LOGINOUT_SUCCESS,
  HOME_USER_LOGINOUT_FAILURE,
  HOME_USER_LOGINOUT_DISMISS_ERROR,
} from './constants';
import {
  Loginout
} from '../api.js'

export function userLoginout() {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: HOME_USER_LOGINOUT_BEGIN,
  };
}

export function dismissUserLoginoutError() {
  return {
    type: HOME_USER_LOGINOUT_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on HOME_USER_LOGINOUT_BEGIN actions
export function* doUserLoginout() {
  // If necessary, use argument to receive the begin action with parameters.
  let res;
  try {
    // Do Ajax call or other async request here. delay(20) is just a placeholder.
    res = yield call(Loginout);
    window.location.reload();
  } catch (err) {
    yield put({
      type: HOME_USER_LOGINOUT_FAILURE,
      data: { error: err },
    });
    return;
  }
  // Dispatch success action out of try/catch so that render errors are not catched.
  yield put({
    type: HOME_USER_LOGINOUT_SUCCESS,
    data: res,
  });
}

/*
  Alternatively you may use takeEvery.

  takeLatest does not allow concurrent requests. If an action gets
  dispatched while another is already pending, that pending one is cancelled
  and only the latest one will be run.
*/
export function* watchUserLoginout() {
  yield takeLatest(HOME_USER_LOGINOUT_BEGIN, doUserLoginout);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case HOME_USER_LOGINOUT_BEGIN:
      return {
        ...state,
        userLoginoutPending: true,
        userLoginoutError: null,
      };

    case HOME_USER_LOGINOUT_SUCCESS:
      return {
        ...state,
        userLoginoutPending: false,
        userLoginoutError: null,
      };

    case HOME_USER_LOGINOUT_FAILURE:
      return {
        ...state,
        userLoginoutPending: false,
        userLoginoutError: action.data.error,
      };

    case HOME_USER_LOGINOUT_DISMISS_ERROR:
      return {
        ...state,
        userLoginoutError: null,
      };

    default:
      return state;
  }
}
