import { takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import {
  CONTRIBUTION_FETCH_RECORD_LIST_BEGIN,
  CONTRIBUTION_FETCH_RECORD_LIST_SUCCESS,
  CONTRIBUTION_FETCH_RECORD_LIST_FAILURE,
  CONTRIBUTION_FETCH_RECORD_LIST_DISMISS_ERROR,
} from './constants';
import {
  getCounts,
  getContributions,
} from '../service.js'

const getStatusMap = state => state.contribution.statusTotalCount;

export function fetchRecordList(payload) {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: CONTRIBUTION_FETCH_RECORD_LIST_BEGIN,
    payload
  };
}

export function dismissFetchRecordListError() {
  return {
    type: CONTRIBUTION_FETCH_RECORD_LIST_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on CONTRIBUTION_FETCH_RECORD_LIST_BEGIN actions
export function* doFetchRecordList(action) {
  const payload = action.payload || {};
  // If necessary, use argument to receive the begin action with parameters.
  let res = {};
  let count = 0;
  try {
    // step 1: 获取每个类别的数量
    const { keyword, page, size, currentTab } = payload;
    let { status } = payload;
    const { data } = yield call(getCounts, keyword);
    const statusMap = yield select(getStatusMap);

    Object.keys(statusMap).forEach(item => {
      const itemCnt = data[item] || 0;
      statusMap[item] = itemCnt;
      count += itemCnt;
    });
    // 自助计算总数
    statusMap.total = count;
    // step 2: 获取列表数据
    if(status === 'total') {
      status = ['UNCHECKED', 'REFUSED', 'CHECKED', 'ONLINE', 'OFFLINE', 'RECALLED'].join(',');
    }
    const { sampleList, totalCount } = yield call(getContributions, { page, size, keyword, status });

    res = {
      statusMap,
      sampleList,
      totalCount,
      currentPage: page,
      currentTab,
      keyword,
    };
  } catch (err) {
    yield put({
      type: CONTRIBUTION_FETCH_RECORD_LIST_FAILURE,
      data: { error: err },
    });
    return;
  }
  // Dispatch success action out of try/catch so that render errors are not catched.
  yield put({
    type: CONTRIBUTION_FETCH_RECORD_LIST_SUCCESS,
    data: res,
  });
}

/*
  Alternatively you may use takeEvery.

  takeLatest does not allow concurrent requests. If an action gets
  dispatched while another is already pending, that pending one is cancelled
  and only the latest one will be run.
*/
export function* watchFetchRecordList() {
  yield takeLatest(CONTRIBUTION_FETCH_RECORD_LIST_BEGIN, doFetchRecordList);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case CONTRIBUTION_FETCH_RECORD_LIST_BEGIN:
      return {
        ...state,
        fetchRecordListPending: true,
        fetchRecordListError: null,
      };

    case CONTRIBUTION_FETCH_RECORD_LIST_SUCCESS:
      const { statusMap, sampleList, totalCount, currentPage, currentTab, keyword } = action.data;

      return {
        ...state,
        fetchRecordListPending: false,
        fetchRecordListError: null,
        statusTotalCount: statusMap,
        sampleList,
        totalCount,
        currentPage,
        currentTab,
        keyword,
      };

    case CONTRIBUTION_FETCH_RECORD_LIST_FAILURE:
      return {
        ...state,
        fetchRecordListPending: false,
        fetchRecordListError: action.data.error,
      };

    case CONTRIBUTION_FETCH_RECORD_LIST_DISMISS_ERROR:
      return {
        ...state,
        fetchRecordListError: null,
      };

    default:
      return state;
  }
}
