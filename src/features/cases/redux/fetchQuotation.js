import { takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { asyncFetchQuotation } from '../service';
import {
  CASES_FETCH_QUOTATION_BEGIN,
  CASES_FETCH_QUOTATION_SUCCESS,
  CASES_FETCH_QUOTATION_FAILURE,
  CASES_FETCH_QUOTATION_DISMISS_ERROR,
} from './constants';

export function fetchQuotation(payload) {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: CASES_FETCH_QUOTATION_BEGIN,
    payload,
  };
}

export function dismissFetchQuotationError() {
  return {
    type: CASES_FETCH_QUOTATION_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on CASES_FETCH_QUOTATION_BEGIN actions
export function* doFetchQuotation(action) {
  // If necessary, use argument to receive the begin action with parameters.
  let res;
  try {
    // Do Ajax call or other async request here. delay(20) is just a placeholder.
    res = yield call(asyncFetchQuotation, action.payload.id);
    
  } catch (err) {
    yield put({
      type: CASES_FETCH_QUOTATION_FAILURE,
      data: { error: err },
    });
    return;
  }
  // Dispatch success action out of try/catch so that render errors are not catched.
  yield put({
    type: CASES_FETCH_QUOTATION_SUCCESS,
    data: res,
  });
}

/*
  Alternatively you may use takeEvery.

  takeLatest does not allow concurrent requests. If an action gets
  dispatched while another is already pending, that pending one is cancelled
  and only the latest one will be run.
*/
export function* watchFetchQuotation() {
  yield takeLatest(CASES_FETCH_QUOTATION_BEGIN, doFetchQuotation);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case CASES_FETCH_QUOTATION_BEGIN:
      return {
        ...state,
        fetchQuotationPending: true,
        fetchQuotationError: null,
      };

    case CASES_FETCH_QUOTATION_SUCCESS:
      return {
        ...state,
        fetchQuotationPending: false,
        fetchQuotationError: null,
        quotation: action.data,
      };

    case CASES_FETCH_QUOTATION_FAILURE:
      return {
        ...state,
        fetchQuotationPending: false,
        fetchQuotationError: action.data.error,
      };

    case CASES_FETCH_QUOTATION_DISMISS_ERROR:
      return {
        ...state,
        fetchQuotationError: null,
      };

    default:
      return state;
  }
}
