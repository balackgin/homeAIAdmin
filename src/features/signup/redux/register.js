import { takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { asyncRegister } from '../api';
import history from '../../../common/history';
import {
  SIGNUP_REGISTER_BEGIN,
  SIGNUP_REGISTER_SUCCESS,
  SIGNUP_REGISTER_FAILURE,
  SIGNUP_REGISTER_DISMISS_ERROR,
} from './constants';

export function register(payload) {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: SIGNUP_REGISTER_BEGIN,
    payload,
  };
}


export function dismissRegisterError() {
  return {
    type: SIGNUP_REGISTER_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on SIGNUP_SIGNUP_BEGIN actions
export function* doRegister(action) {
  try {
    yield call(asyncRegister, action.payload);
    yield put({
      type: 'UPDATE_USERINFO',
      payload: {
        userInfo: action.payload
      },
    });
    history.replace('/');
  } catch (err) {
    yield put({
      type: SIGNUP_REGISTER_FAILURE,
      data: { error: err },
    });
    return;
  }
}

/*
  Alternatively you may use takeEvery.

  takeLatest does not allow concurrent requests. If an action gets
  dispatched while another is already pending, that pending one is cancelled
  and only the latest one will be run.
*/
export function* watchRegister() {
  yield takeLatest(SIGNUP_REGISTER_BEGIN, doRegister);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case SIGNUP_REGISTER_BEGIN:
      return {
        ...state,
        registerPending: true,
        registerError: null,
      };

    case SIGNUP_REGISTER_SUCCESS:
      return {
        ...state,
        registerPending: false,
        registerError: null,
      };

    case SIGNUP_REGISTER_FAILURE:
      return {
        ...state,
        registerPending: false,
        registerError: action.data.error,
      };

    case SIGNUP_REGISTER_DISMISS_ERROR:
      return {
        ...state,
        registerError: null,
      };

    default:
      return state;
  }
}
