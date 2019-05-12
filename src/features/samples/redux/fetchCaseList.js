import { takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import {
  SAMPLES_FETCH_CASE_LIST_BEGIN,
  SAMPLES_FETCH_CASE_LIST_SUCCESS,
  SAMPLES_FETCH_CASE_LIST_FAILURE,
  SAMPLES_FETCH_CASE_LIST_DISMISS_ERROR,
} from './constants';
import { getCaseList } from '../api';

export function fetchCaseList(page) {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: SAMPLES_FETCH_CASE_LIST_BEGIN,
    payload: {
      page
    }
  };
}

export function dismissFetchCaseListError() {
  return {
    type: SAMPLES_FETCH_CASE_LIST_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on SAMPLES_FETCH_CASE_LIST_BEGIN actions
export function* doFetchCaseList({payload}) {
  // If necessary, use argument to receive the begin action with parameters.
  const { page } = payload;
  try {
    const size = 6;
    // Do Ajax call or other async request here. delay(20) is just a placeholder.
    const { cases, count } = yield call(getCaseList, page, size);
    yield put({
      type: SAMPLES_FETCH_CASE_LIST_SUCCESS,
      payload: {
        caseList: cases,
        count
      },
    });
  } catch (err) {
    yield put({
      type: SAMPLES_FETCH_CASE_LIST_FAILURE,
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
export function* watchFetchCaseList() {
  yield takeLatest(SAMPLES_FETCH_CASE_LIST_BEGIN, doFetchCaseList);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case SAMPLES_FETCH_CASE_LIST_BEGIN:
      return {
        ...state,
        fetchCaseListPending: true,
        fetchCaseListError: null,
      };

    case SAMPLES_FETCH_CASE_LIST_SUCCESS:
      return {
        ...state,
        fetchCaseListPending: false,
        fetchCaseListError: null,
        ...action.payload
      };

    case SAMPLES_FETCH_CASE_LIST_FAILURE:
      return {
        ...state,
        fetchCaseListPending: false,
        fetchCaseListError: action.data.error,
      };

    case SAMPLES_FETCH_CASE_LIST_DISMISS_ERROR:
      return {
        ...state,
        fetchCaseListError: null,
      };

    default:
      return state;
  }
}
