import { takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import { getSampleList } from '../api';
import {
  SAMPLES_FETCH_SAMPLE_LIST_BEGIN,
  SAMPLES_FETCH_SAMPLE_LIST_SUCCESS,
  SAMPLES_FETCH_SAMPLE_LIST_FAILURE,
  SAMPLES_FETCH_SAMPLE_LIST_DISMISS_ERROR,
} from './constants';

const getKeyword = state => state.samples.keyword;

export function fetchSampleList(page, keyword) {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: SAMPLES_FETCH_SAMPLE_LIST_BEGIN,
    payload: {
      page,
      keyword
    }
  };
}

export function dismissFetchSampleListError() {
  return {
    type: SAMPLES_FETCH_SAMPLE_LIST_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on SAMPLES_FETCH_SAMPLE_LIST_BEGIN actions
export function* doFetchSampleList({ payload }) {
  // If necessary, use argument to receive the begin action with parameters.
  try {
    // Do Ajax call or other async request here. delay(20) is just a placeholder.
    const { page } = payload;
    const keyword = yield select(getKeyword);
    const size = 8;
    const { sampleList, totalCount } = yield call(getSampleList, page, size, keyword);
    yield put({
      type: SAMPLES_FETCH_SAMPLE_LIST_SUCCESS,
      data: {
        sampleList,
        totalCount
      },
    });
  } catch (err) {
    yield put({
      type: SAMPLES_FETCH_SAMPLE_LIST_FAILURE,
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
export function* watchFetchSampleList() {
  yield takeLatest(SAMPLES_FETCH_SAMPLE_LIST_BEGIN, doFetchSampleList);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case SAMPLES_FETCH_SAMPLE_LIST_BEGIN:
      const { page, keyword } = action.payload;
      return {
        ...state,
        fetchSampleListPending: true,
        fetchSampleListError: null,
        curPage: page,
        keyword
      };

    case SAMPLES_FETCH_SAMPLE_LIST_SUCCESS:
      const { sampleList, totalCount } = action.data;
      return {
        ...state,
        fetchSampleListPending: false,
        fetchSampleListError: null,
        sampleList,
        totalCount
      };

    case SAMPLES_FETCH_SAMPLE_LIST_FAILURE:
      return {
        ...state,
        fetchSampleListPending: false,
        fetchSampleListError: action.data.error,
      };

    case SAMPLES_FETCH_SAMPLE_LIST_DISMISS_ERROR:
      return {
        ...state,
        fetchSampleListError: null,
      };

    default:
      return state;
  }
}
