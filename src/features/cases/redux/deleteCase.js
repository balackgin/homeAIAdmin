import { takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { asyncDeleteCase } from '../service';
import {
  CASES_DELETE_CASE_BEGIN,
  CASES_DELETE_CASE_SUCCESS,
  CASES_DELETE_CASE_FAILURE,
  CASES_DELETE_CASE_DISMISS_ERROR,
} from './constants';

export function deleteCase(payload) {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: CASES_DELETE_CASE_BEGIN,
    payload,
  };
}

export function dismissDeleteCaseError() {
  return {
    type: CASES_DELETE_CASE_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on CASES_DELETE_CASE_BEGIN actions
export function* doDeleteCase(action) {
  // If necessary, use argument to receive the begin action with parameters.
  let res;
  try {
    // Do Ajax call or other async request here. delay(20) is just a placeholder.
    res = yield call(asyncDeleteCase, action.payload.caseId.toString());
  } catch (err) {
    yield put({
      type: CASES_DELETE_CASE_FAILURE,
      data: { error: err },
    });
    return;
  }
  // Dispatch success action out of try/catch so that render errors are not catched.

  yield put({
    type: CASES_DELETE_CASE_SUCCESS,
    data: res,
  });

  // 删除成功之后需要重新获取一次列表数据，并且默认从第0页开始
  action.payload.cb && action.payload.cb();
}

/*
  Alternatively you may use takeEvery.

  takeLatest does not allow concurrent requests. If an action gets
  dispatched while another is already pending, that pending one is cancelled
  and only the latest one will be run.
*/
export function* watchDeleteCase() {
  yield takeLatest(CASES_DELETE_CASE_BEGIN, doDeleteCase);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case CASES_DELETE_CASE_BEGIN:
      return {
        ...state,
        deleteCasePending: true,
        deleteCaseError: null,
      };

    case CASES_DELETE_CASE_SUCCESS:
      return {
        ...state,
        deleteCasePending: false,
        deleteCaseError: null,
      };

    case CASES_DELETE_CASE_FAILURE:
      return {
        ...state,
        deleteCasePending: false,
        deleteCaseError: action.data.error,
      };

    case CASES_DELETE_CASE_DISMISS_ERROR:
      return {
        ...state,
        deleteCaseError: null,
      };

    default:
      return state;
  }
}
