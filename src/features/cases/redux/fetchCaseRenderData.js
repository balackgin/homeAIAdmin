import { takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { servicesWithSpin } from '../service';
import {
  CASES_FETCH_CASE_RENDER_DATA_BEGIN,
  CASES_FETCH_CASE_RENDER_DATA_SUCCESS,
  CASES_FETCH_CASE_RENDER_DATA_FAILURE,
  CASES_FETCH_CASE_RENDER_DATA_DISMISS_ERROR,
} from './constants';

export function fetchCaseRenderData(payload, cb) {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: CASES_FETCH_CASE_RENDER_DATA_BEGIN,
    payload,
    cb,
  };
}

export function dismissFetchCaseRenderDataError() {
  return {
    type: CASES_FETCH_CASE_RENDER_DATA_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on CASES_FETCH_CASE_RENDER_DATA_BEGIN actions
export function* doFetchCaseRenderData(action) {
  // If necessary, use argument to receive the begin action with parameters.
  let res;
  try {
    res = yield call(servicesWithSpin.asyncFetchCaseRenderData, action.payload.caseId);
  } catch (err) {
    yield put({
      type: CASES_FETCH_CASE_RENDER_DATA_FAILURE,
      data: { error: err },
    });
    return;
  }
  // Dispatch success action out of try/catch so that render errors are not catched.
  yield put({
    type: CASES_FETCH_CASE_RENDER_DATA_SUCCESS,
    data: res,
  });

  action.cb && action.cb(res);
}

/*
  Alternatively you may use takeEvery.

  takeLatest does not allow concurrent requests. If an action gets
  dispatched while another is already pending, that pending one is cancelled
  and only the latest one will be run.
*/
export function* watchFetchCaseRenderData() {
  yield takeLatest(CASES_FETCH_CASE_RENDER_DATA_BEGIN, doFetchCaseRenderData);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case CASES_FETCH_CASE_RENDER_DATA_BEGIN:
      return {
        ...state,
        fetchCaseRenderDataPending: true,
        fetchCaseRenderDataError: null,
      };

    case CASES_FETCH_CASE_RENDER_DATA_SUCCESS:
      return {
        ...state,
        fetchCaseRenderDataPending: false,
        fetchCaseRenderDataError: null,
        renderData: action.data,
        startLocation: action.data.startLocation || {}, // 起始点数据和导览图数据从服务端获取时就已经分离完成
        guideMap: action.data.guides || [],
        customTags: action.data.tags.tagList || [],
      };

    case CASES_FETCH_CASE_RENDER_DATA_FAILURE:
      return {
        ...state,
        fetchCaseRenderDataPending: false,
        fetchCaseRenderDataError: action.data.error,
      };

    case CASES_FETCH_CASE_RENDER_DATA_DISMISS_ERROR:
      return {
        ...state,
        fetchCaseRenderDataError: null,
      };

    default:
      return state;
  }
}
