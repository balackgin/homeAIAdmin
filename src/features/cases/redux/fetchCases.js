import { takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { asyncFetchCases } from '../service';
import {
  CASES_FETCH_CASES_BEGIN,
  CASES_FETCH_CASES_SUCCESS,
  CASES_FETCH_CASES_FAILURE,
  CASES_FETCH_CASES_DISMISS_ERROR,
} from './constants';

const getPageSize = state => state.cases.pageSize;

export function fetchCases(payload) {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: CASES_FETCH_CASES_BEGIN,
    payload,
  };
}

export function dismissFetchCasesError() {
  return {
    type: CASES_FETCH_CASES_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on CASES_FETCH_CASES_BEGIN actions
export function* doFetchCases(action) {
  // If necessary, use argument to receive the begin action with parameters.
  let res;
  try {
    const size = yield select(getPageSize);
    // Do Ajax call or other async request here. delay(20) is just a placeholder.
    res = yield call(asyncFetchCases, action.payload.current, size);
  } catch (err) {
    yield put({
      type: CASES_FETCH_CASES_FAILURE,
      data: { error: err },
    });
    return;
  }
  // Dispatch success action out of try/catch so that render errors are not catched.
  yield put({
    type: CASES_FETCH_CASES_SUCCESS,
    data: res,
  });
}

/*
  Alternatively you may use takeEvery.

  takeLatest does not allow concurrent requests. If an action gets
  dispatched while another is already pending, that pending one is cancelled
  and only the latest one will be run.
*/
export function* watchFetchCases() {
  yield takeLatest(CASES_FETCH_CASES_BEGIN, doFetchCases);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case CASES_FETCH_CASES_BEGIN:
      return {
        ...state,
        fetchCasesPending: true,
        fetchCasesError: null,
      };

    case CASES_FETCH_CASES_SUCCESS:
      const { data = {} } = action;
      return {
        ...state,
        fetchCasesPending: false,
        fetchCasesError: null,
        list: data.list,
        current: data.current,
        total: data.total,
      };

    case CASES_FETCH_CASES_FAILURE:
      return {
        ...state,
        fetchCasesPending: false,
        fetchCasesError: action.data.error,
      };

    case CASES_FETCH_CASES_DISMISS_ERROR:
      return {
        ...state,
        fetchCasesError: null,
      };

    default:
      return state;
  }
}
