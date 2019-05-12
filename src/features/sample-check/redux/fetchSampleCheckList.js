import { takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import {
  SAMPLE_CHECK_FETCH_SAMPLE_CHECK_LIST_BEGIN,
  SAMPLE_CHECK_FETCH_SAMPLE_CHECK_LIST_SUCCESS,
  SAMPLE_CHECK_FETCH_SAMPLE_CHECK_LIST_FAILURE,
  SAMPLE_CHECK_FETCH_SAMPLE_CHECK_LIST_DISMISS_ERROR,
} from './constants';
import { getSampleCheckList } from '../api';

const getCurPage = state => state.sampleCheck.curPage;
const getCurType = state => state.sampleCheck.curType;

export function fetchSampleCheckList(page, status) {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: SAMPLE_CHECK_FETCH_SAMPLE_CHECK_LIST_BEGIN,
    payload: {
      page,
      status
    }
  };
}
const statusMap = {
  UNCHECKED: 0,
  REFUSED: 0
}

export function dismissFetchSampleCheckListError() {
  return {
    type: SAMPLE_CHECK_FETCH_SAMPLE_CHECK_LIST_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on SAMPLE_CHECK_FETCH_SAMPLE_CHECK_LIST_BEGIN actions
export function* doFetchSampleCheckList() {
  // If necessary, use argument to receive the begin action with parameters.
  try {
    const page = yield select(getCurPage);
    const status = yield select(getCurType);
    const size = 10;
    const { dataArr, totalCount, statusCount } = yield call(getSampleCheckList, { page: page[status], size, status });
    Object.keys(statusMap).forEach(item => {
      statusMap[item] = statusCount[item] || 0;
    });
    yield put({
      type: SAMPLE_CHECK_FETCH_SAMPLE_CHECK_LIST_SUCCESS,
      payload: {
        dataArr,
        statusCount: statusMap,
        totalCount: totalCount
      }
    });
  } catch (err) {
    yield put({
      type: SAMPLE_CHECK_FETCH_SAMPLE_CHECK_LIST_FAILURE,
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
export function* watchFetchSampleCheckList() {
  yield takeLatest(SAMPLE_CHECK_FETCH_SAMPLE_CHECK_LIST_BEGIN, doFetchSampleCheckList);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case SAMPLE_CHECK_FETCH_SAMPLE_CHECK_LIST_BEGIN:
      const { page, status } = action.payload;
      return {
        ...state,
        fetchSampleCheckListPending: true,
        fetchSampleCheckListError: null,
        curPage: {
          ...state.curPage,
          [status]: page
        },
        curType: status
      };

    case SAMPLE_CHECK_FETCH_SAMPLE_CHECK_LIST_SUCCESS:
      const { dataArr, totalCount, statusCount } = action.payload;
      return {
        ...state,
        fetchSampleCheckListPending: false,
        fetchSampleCheckListError: null,
        sampleCheckList: dataArr,
        totalCount,
        statusCount
      };

    case SAMPLE_CHECK_FETCH_SAMPLE_CHECK_LIST_FAILURE:
      return {
        ...state,
        fetchSampleCheckListPending: false,
        fetchSampleCheckListError: action.data.error,
      };

    case SAMPLE_CHECK_FETCH_SAMPLE_CHECK_LIST_DISMISS_ERROR:
      return {
        ...state,
        fetchSampleCheckListError: null,
      };

    default:
      return state;
  }
}
