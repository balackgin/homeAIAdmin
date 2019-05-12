import { takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { asyncVerify } from '../api';
import {
  SIGNUP_GENERATE_VERIFY_CODE_BEGIN,
  SIGNUP_GENERATE_VERIFY_CODE_SUCCESS,
  SIGNUP_GENERATE_VERIFY_CODE_FAILURE,
  SIGNUP_GENERATE_VERIFY_CODE_DISMISS_ERROR,
} from './constants';

export function generateVerifyCode(payload) {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: SIGNUP_GENERATE_VERIFY_CODE_BEGIN,
    payload,
  };
}

export function dismissGenerateVerifyCodeError() {
  return {
    type: SIGNUP_GENERATE_VERIFY_CODE_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on SIGNUP_VERIFY_BEGIN actions
export function* doGenerateVerifyCode(action) {
  // If necessary, use argument to receive the begin action with parameters.
  let res;
  try {
    // Do Ajax call or other async request here. delay(20) is just a placeholder.
    res = yield call(asyncVerify, action.payload);
  } catch (err) {
    yield put({
      type: SIGNUP_GENERATE_VERIFY_CODE_FAILURE,
      data: { error: err },
    });
    return;
  }
  // Dispatch success action out of try/catch so that render errors are not catched.
  yield put({
    type: SIGNUP_GENERATE_VERIFY_CODE_SUCCESS,
    data: res,
  });
}

/*
  Alternatively you may use takeEvery.

  takeLatest does not allow concurrent requests. If an action gets
  dispatched while another is already pending, that pending one is cancelled
  and only the latest one will be run.
*/
export function* watchGenerateVerifyCode() {
  yield takeLatest(SIGNUP_GENERATE_VERIFY_CODE_BEGIN, doGenerateVerifyCode);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case SIGNUP_GENERATE_VERIFY_CODE_BEGIN:
      return {
        ...state,
        generateVerifyCodePending: true,
        generateVerifyCodeError: null,
      };

    case SIGNUP_GENERATE_VERIFY_CODE_SUCCESS:
      return {
        ...state,
        generateVerifyCodePending: false,
        generateVerifyCodeError: null,
        // formStage: FORM_STAGE.DETAIL_INFO_FORM,
      };

    case SIGNUP_GENERATE_VERIFY_CODE_FAILURE:
      return {
        ...state,
        generateVerifyCodePending: false,
        generateVerifyCodeError: action.data.error,
      };

    case SIGNUP_GENERATE_VERIFY_CODE_DISMISS_ERROR:
      return {
        ...state,
        generateVerifyCodeError: null,
      };

    default:
      return state;
  }
}
