import { takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import {
  OPERATOR_GET_OPERATIONS_BEGIN,
  OPERATOR_GET_OPERATIONS_SUCCESS,
  OPERATOR_GET_OPERATIONS_FAILURE,
  OPERATOR_GET_OPERATIONS_DISMISS_ERROR,
} from './constants';

import {
  getOperationsResult
} from '../service.js';

const defaultStatus = ['OFFLINE', 'ONLINE', 'CHECKED'];

export function getOperations(params) {
  // If need to pass args to saga, pass it with the begin action.
  let { status = [], keyword, page, size } = params;
  if(typeof status === 'string') {
  } else {
    status = status.length === 0 ? defaultStatus.join('|') : status.join('|');
  }
  
  if (typeof status !== 'string') {
    status = status.length === 0 ? defaultStatus.join('|') : status.join('|');
  }

  return {
    type: OPERATOR_GET_OPERATIONS_BEGIN,
    status,
    keyword,
    page,
    size
  };
}

export function dismissGetOperationsError() {
  return {
    type: OPERATOR_GET_OPERATIONS_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on OPERATOR_GET_OPERATIONS_BEGIN actions
export function* doGetOperations(params) {
  // If necessary, use argument to receive the begin action with parameters.
  let res;
  try {
    // Do Ajax call or other async request here. delay(20) is just a placeholder.
    const { page, size, keyword, status } = params;
    res = yield call(getOperationsResult, { page, size, keyword, status });
    yield put({
      type: OPERATOR_GET_OPERATIONS_SUCCESS,
      data: res,
      keyword,
      page,
      status
    });
  } catch (err) {
    yield put({
      type: OPERATOR_GET_OPERATIONS_FAILURE,
      data: { error: err },
    });
    return;
  }
  // Dispatch success action out of try/catch so that render errors are not catched.
}

/*
  Alternatively you may use takeEvery.

  takeLatest does not allow concurrent requests. If an action gets
  dispatched while another is already pending, that pending one is cancelled
  and only the latest one will be run.
*/
export function* watchGetOperations() {
  yield takeLatest(OPERATOR_GET_OPERATIONS_BEGIN, doGetOperations);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case OPERATOR_GET_OPERATIONS_BEGIN:
      return {
        ...state,
        getOperationsPending: true,
        getOperationsError: null
      };

    case OPERATOR_GET_OPERATIONS_SUCCESS:
      const { keyword, page, status} = action;
      const { operations = [], statusTotalCount, totalCount } = action.data;
      return {
        ...state,
        getOperationsPending: false,
        getOperationsError: null,
        operations,
        statusTotalCount,
        totalCount,
        page,
        status,
        keyword
      };

    case OPERATOR_GET_OPERATIONS_FAILURE:
      return {
        ...state,
        getOperationsPending: false,
        getOperationsError: action.data.error,
      };

    case OPERATOR_GET_OPERATIONS_DISMISS_ERROR:
      return {
        ...state,
        getOperationsError: null,
      };

    default:
      return state;
  }
}
