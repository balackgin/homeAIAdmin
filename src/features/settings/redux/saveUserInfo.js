import { takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { updateUserinfo } from '../api';
import { showSuccessMsg } from '../../common/redux/actions';
import {
  SETTINGS_SAVE_USER_INFO_BEGIN,
  SETTINGS_SAVE_USER_INFO_SUCCESS,
  SETTINGS_SAVE_USER_INFO_FAILURE,
  SETTINGS_SAVE_USER_INFO_DISMISS_ERROR,
} from './constants';

export function saveUserInfo(payload) {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: SETTINGS_SAVE_USER_INFO_BEGIN,
    payload
  };
}

export function dismissSaveUserInfoError() {
  return {
    type: SETTINGS_SAVE_USER_INFO_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on SETTINGS_SAVE_USER_INFO_BEGIN actions
export function* doSaveUserInfo(action) {
  // If necessary, use argument to receive the begin action with parameters.
  try {
    // to be refactor later!!!
    if (!action.payload.avatar) {
      action.payload.avatar = '';
    }
    
    yield call(updateUserinfo, action.payload);
    yield put({
      type: SETTINGS_SAVE_USER_INFO_SUCCESS,
      payload: {
        userInfo: action.payload,
      },
    });
    // modify global userInfo
    yield put({
      type: 'UPDATE_USERINFO',
      payload: {
        userInfo: action.payload,
      },
    });
    yield put(showSuccessMsg('修改成功'));
  } catch (err) {
    yield put({
      type: SETTINGS_SAVE_USER_INFO_FAILURE,
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
export function* watchSaveUserInfo() {
  yield takeLatest(SETTINGS_SAVE_USER_INFO_BEGIN, doSaveUserInfo);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case SETTINGS_SAVE_USER_INFO_BEGIN:
      return {
        ...state,
        saveUserInfoPending: true,
        saveUserInfoError: null,
      };

    case SETTINGS_SAVE_USER_INFO_SUCCESS:
      return {
        ...state,
        saveUserInfoPending: false,
        saveUserInfoError: null,
        editStatus: false
      };

    case SETTINGS_SAVE_USER_INFO_FAILURE:
      return {
        ...state,
        editStatus: false,
        saveUserInfoPending: false,
        saveUserInfoError: action.data.error,
      };

    case SETTINGS_SAVE_USER_INFO_DISMISS_ERROR:
      return {
        ...state,
        saveUserInfoError: null,
      };

    default:
      return state;
  }
}
