import { takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import {
  SIGNUP_VERIFY_CODE_BEGIN,
  SIGNUP_VERIFY_CODE_SUCCESS,
  SIGNUP_VERIFY_CODE_FAILURE,
  SIGNUP_VERIFY_CODE_DISMISS_ERROR,
  FORM_STAGE
} from './constants';

import { checkVerify } from '../api';
import history from '../../../common/history';

export function verifyCode(role, code) {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: SIGNUP_VERIFY_CODE_BEGIN,
    payload: {role, code}
  };
}

export function dismissVerifyCodeError() {
  return {
    type: SIGNUP_VERIFY_CODE_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on SIGNUP_VERIFY_CODE_BEGIN actions
export function* doVerifyCode(action) {
  const {role, code} = action.payload;
  try {
    // Do Ajax call or other async request here. delay(20) is just a placeholder.
    
    yield call(checkVerify, code);
  } catch (err) {
    yield put({
      type: SIGNUP_VERIFY_CODE_FAILURE,
      data: { error: err },
    });
    return;
  }

  if (role === 'pd') {
    history.replace('/');
    return;
  }

  // Dispatch success action out of try/catch so that render errors are not catched.
  yield put({
    type: SIGNUP_VERIFY_CODE_SUCCESS,
    payload: code,
  });
}

/*
  Alternatively you may use takeEvery.

  takeLatest does not allow concurrent requests. If an action gets
  dispatched while another is already pending, that pending one is cancelled
  and only the latest one will be run.
*/
export function* watchVerifyCode() {
  yield takeLatest(SIGNUP_VERIFY_CODE_BEGIN, doVerifyCode);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case SIGNUP_VERIFY_CODE_BEGIN:
      return {
        ...state,
        verifyCodePending: true,
        verifyCodeError: null,
      };

    case SIGNUP_VERIFY_CODE_SUCCESS:
      return {
        ...state,
        verifyCodePending: false,
        verifyCodeError: null,
        code: action.payload,
        formStage: FORM_STAGE.DETAIL_INFO_FORM,
      };

    case SIGNUP_VERIFY_CODE_FAILURE:
      return {
        ...state,
        verifyCodePending: false,
        verifyCodeError: action.data.error,
      };

    case SIGNUP_VERIFY_CODE_DISMISS_ERROR:
      return {
        ...state,
        verifyCodeError: null,
      };

    default:
      return state;
  }
}
