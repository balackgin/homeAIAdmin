import { takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import {
  getProjectList
} from '../service';

import {
  PROJECT_FETCH_PROJECT_LIST_BEGIN,
  PROJECT_FETCH_PROJECT_LIST_SUCCESS,
  PROJECT_FETCH_PROJECT_LIST_FAILURE,
  PROJECT_FETCH_PROJECT_LIST_DISMISS_ERROR,
} from './constants';

export function fetchProjectList(status, page, keyword) {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: PROJECT_FETCH_PROJECT_LIST_BEGIN,
    payload: {
      status,
      page,
      keyword
    }
  };
}

export function dismissFetchProjectListError() {
  return {
    type: PROJECT_FETCH_PROJECT_LIST_DISMISS_ERROR,
  };
}

// selectors
const getCurPage = state => state.project.curPage;
const getCurTab = state => state.project.curTab;
const getKeyword = state => state.project.keyword;

// worker Saga: will be fired on PROJECT_FETCH_PROJECT_LIST_BEGIN actions
export function* doFetchProjectList() {
  // If necessary, use argument to receive the begin action with parameters.
  try {
    const page = yield select(getCurPage);
    const status = yield select(getCurTab);
    const keyword = yield select(getKeyword);
    const size = 10;
    const data = yield call(getProjectList, status, page, size, keyword);
    yield put({
      type: PROJECT_FETCH_PROJECT_LIST_SUCCESS,
      data,
    });
  } catch (err) {
    yield put({
      type: PROJECT_FETCH_PROJECT_LIST_FAILURE,
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
export function* watchFetchProjectList() {
  yield takeLatest(PROJECT_FETCH_PROJECT_LIST_BEGIN, doFetchProjectList);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case PROJECT_FETCH_PROJECT_LIST_BEGIN:
      const { status, page, keyword } = action.payload;
      return {
        ...state,
        fetchProjectListPending: true,
        fetchProjectListError: null,
        curTab: status,
        curPage: page,
        keyword
      };

    case PROJECT_FETCH_PROJECT_LIST_SUCCESS:
      const { projectList, statusTotalCount, totalCount } = action.data;
      return {
        ...state,
        fetchProjectListPending: false,
        fetchProjectListError: null,
        projectList,
        statusTotalCount,
        totalCount
      };

    case PROJECT_FETCH_PROJECT_LIST_FAILURE:
      return {
        ...state,
        fetchProjectListPending: false,
        fetchProjectListError: action.data.error,
      };

    case PROJECT_FETCH_PROJECT_LIST_DISMISS_ERROR:
      return {
        ...state,
        fetchProjectListError: null,
      };

    default:
      return state;
  }
}

