import { delay, takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import {
  CASES_FETCH_ITEM_LIST_BEGIN,
  CASES_FETCH_ITEM_LIST_SUCCESS,
  CASES_FETCH_ITEM_LIST_FAILURE,
  CASES_FETCH_ITEM_LIST_DISMISS_ERROR,
} from './constants';

export function fetchItemList() {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: CASES_FETCH_ITEM_LIST_BEGIN,
  };
}

export function dismissFetchItemListError() {
  return {
    type: CASES_FETCH_ITEM_LIST_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on CASES_FETCH_ITEM_LIST_BEGIN actions
export function* doFetchItemList() {
  // If necessary, use argument to receive the begin action with parameters.
  let res;
  try {
    // Do Ajax call or other async request here. delay(20) is just a placeholder.
    res = yield call(delay, 20);
  } catch (err) {
    yield put({
      type: CASES_FETCH_ITEM_LIST_FAILURE,
      data: { error: err },
    });
    return;
  }
  // Dispatch success action out of try/catch so that render errors are not catched.
  yield put({
    type: CASES_FETCH_ITEM_LIST_SUCCESS,
    data: res,
  });
}

/*
  Alternatively you may use takeEvery.

  takeLatest does not allow concurrent requests. If an action gets
  dispatched while another is already pending, that pending one is cancelled
  and only the latest one will be run.
*/
export function* watchFetchItemList() {
  yield takeLatest(CASES_FETCH_ITEM_LIST_BEGIN, doFetchItemList);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case CASES_FETCH_ITEM_LIST_BEGIN:
      return {
        ...state,
        fetchItemListPending: true,
        fetchItemListError: null,
      };

    case CASES_FETCH_ITEM_LIST_SUCCESS:
      return {
        ...state,
        fetchItemListPending: false,
        fetchItemListError: null,
      };

    case CASES_FETCH_ITEM_LIST_FAILURE:
      return {
        ...state,
        fetchItemListPending: false,
        fetchItemListError: action.data.error,
      };

    case CASES_FETCH_ITEM_LIST_DISMISS_ERROR:
      return {
        ...state,
        fetchItemListError: null,
      };

    default:
      return state;
  }
}
