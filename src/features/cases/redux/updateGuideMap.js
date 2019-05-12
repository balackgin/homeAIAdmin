import { takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { servicesWithSpin } from '../service';
import {
  CASES_UPDATE_GUIDE_MAP_BEGIN,
  CASES_UPDATE_GUIDE_MAP_SUCCESS,
  CASES_UPDATE_GUIDE_MAP_FAILURE,
  CASES_UPDATE_GUIDE_MAP_DISMISS_ERROR,
} from './constants';

export function updateGuideMap(payload) {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: CASES_UPDATE_GUIDE_MAP_BEGIN,
    payload,
  };
}

export function dismissUpdateGuideMapError() {
  return {
    type: CASES_UPDATE_GUIDE_MAP_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on CASES_UPDATE_GUIDE_MAP_BEGIN actions
export function* doUpdateGuideMap(action) {
  // If necessary, use argument to receive the begin action with parameters.
  let res;
  try {
    res = yield call(servicesWithSpin.asyncUpdateGuideMapName, action.payload);
  } catch (err) {
    yield put({
      type: CASES_UPDATE_GUIDE_MAP_FAILURE,
      data: { error: err },
    });
    return;
  }
  // Dispatch success action out of try/catch so that render errors are not catched.
  yield put({
    type: CASES_UPDATE_GUIDE_MAP_SUCCESS,
    data: res,
  });
}

/*
  Alternatively you may use takeEvery.

  takeLatest does not allow concurrent requests. If an action gets
  dispatched while another is already pending, that pending one is cancelled
  and only the latest one will be run.
*/
export function* watchUpdateGuideMap() {
  yield takeLatest(CASES_UPDATE_GUIDE_MAP_BEGIN, doUpdateGuideMap);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case CASES_UPDATE_GUIDE_MAP_BEGIN:
      return {
        ...state,
        updateGuideMapPending: true,
        updateGuideMapError: null,
      };

    case CASES_UPDATE_GUIDE_MAP_SUCCESS:
      return {
        ...state,
        updateGuideMapPending: false,
        updateGuideMapError: null,
        guideMap: action.data,
      };

    case CASES_UPDATE_GUIDE_MAP_FAILURE:
      return {
        ...state,
        updateGuideMapPending: false,
        updateGuideMapError: action.data.error,
      };

    case CASES_UPDATE_GUIDE_MAP_DISMISS_ERROR:
      return {
        ...state,
        updateGuideMapError: null,
      };

    default:
      return state;
  }
}
