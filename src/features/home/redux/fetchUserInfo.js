import { takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import {
  HOME_FETCH_USER_INFO_BEGIN,
  HOME_FETCH_USER_INFO_SUCCESS,
  HOME_FETCH_USER_INFO_FAILURE,
  HOME_FETCH_USER_INFO_DISMISS_ERROR,
} from './constants';

import {servicesWithSpin} from '../service';

export function fetchUserInfo() {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: HOME_FETCH_USER_INFO_BEGIN,
  };
}

export function dismissFetchUserInfoError() {
  return {
    type: HOME_FETCH_USER_INFO_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on HOME_FETCH_USER_INFO_BEGIN actions
export function* doFetchUserInfo() {
  // If necessary, use argument to receive the begin action with parameters.
  let userInfo;
  try {
    // Do Ajax call or other async request here. delay(20) is just a placeholder.
    userInfo = yield call(servicesWithSpin.fetchUserInfo);
  } catch (err) {
    yield put({
      type: HOME_FETCH_USER_INFO_FAILURE,
      data: { error: err },
    });
    return;
  }
  // Dispatch success action out of try/catch so that render errors are not catched.
  yield put({
    type: HOME_FETCH_USER_INFO_SUCCESS,
    payload: userInfo,
  });
}

/*
  Alternatively you may use takeEvery.

  takeLatest does not allow concurrent requests. If an action gets
  dispatched while another is already pending, that pending one is cancelled
  and only the latest one will be run.
*/
export function* watchFetchUserInfo() {
  yield takeLatest(HOME_FETCH_USER_INFO_BEGIN, doFetchUserInfo);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case HOME_FETCH_USER_INFO_BEGIN:
      return {
        ...state,
        fetchUserInfoPending: true,
        fetchUserInfoError: null,
      };

    case HOME_FETCH_USER_INFO_SUCCESS:
      return {
        ...state,
        fetchUserInfoPending: false,
        fetchUserInfoError: null,
        userInfo: action.payload
      };

    case HOME_FETCH_USER_INFO_FAILURE:
      return {
        ...state,
        fetchUserInfoPending: false,
        fetchUserInfoError: action.data.error,
      };

    case HOME_FETCH_USER_INFO_DISMISS_ERROR:
      return {
        ...state,
        fetchUserInfoError: null,
      };

    default:
      return state;
  }
}
