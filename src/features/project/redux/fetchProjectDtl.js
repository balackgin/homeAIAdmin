import { takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import { getProjectDtl } from '../service';

import {
  PROJECT_FETCH_PROJECT_DTL_BEGIN,
  PROJECT_FETCH_PROJECT_DTL_SUCCESS,
  PROJECT_FETCH_PROJECT_DTL_FAILURE,
  PROJECT_FETCH_PROJECT_DTL_DISMISS_ERROR,
} from './constants';

export function fetchProjectDtl(id) {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: PROJECT_FETCH_PROJECT_DTL_BEGIN,
    payload: {
      id
    }
  };
}

export function dismissFetchProjectDtlError() {
  return {
    type: PROJECT_FETCH_PROJECT_DTL_DISMISS_ERROR,
  };
}


// worker Saga: will be fired on PROJECT_FETCH_PROJECT_DTL_BEGIN actions
export function* doFetchProjectDtl({ payload }) {
  try {
    // Do Ajax call or other async request here. delay(20) is just a placeholder.
    const data = yield call(getProjectDtl, payload.id);
    yield put({
      type: PROJECT_FETCH_PROJECT_DTL_SUCCESS,
      data
    })
  } catch (err) {
    yield put({
      type: PROJECT_FETCH_PROJECT_DTL_FAILURE,
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
export function* watchFetchProjectDtl() {
  yield takeLatest(PROJECT_FETCH_PROJECT_DTL_BEGIN, doFetchProjectDtl);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case PROJECT_FETCH_PROJECT_DTL_BEGIN:
      return {
        ...state,
        fetchProjectDtlPending: true,
        fetchProjectDtlError: null
      };

    case PROJECT_FETCH_PROJECT_DTL_SUCCESS:
      return {
        ...state,
        fetchProjectDtlPending: false,
        fetchProjectDtlError: null,
        projectDetail: action.data
      };

    case PROJECT_FETCH_PROJECT_DTL_FAILURE:
      return {
        ...state,
        fetchProjectDtlPending: false,
        fetchProjectDtlError: action.data.error,
      };

    case PROJECT_FETCH_PROJECT_DTL_DISMISS_ERROR:
      return {
        ...state,
        fetchProjectDtlError: null,
      };

    default:
      return state;
  }
}
