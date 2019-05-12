import Hashids from 'hashids';
import { takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { message } from 'antd';
import { servicesWithSpin } from '../service';
import {
  CASES_SAVE_GUIDE_MAP_BEGIN,
  CASES_SAVE_GUIDE_MAP_SUCCESS,
  CASES_SAVE_GUIDE_MAP_FAILURE,
  CASES_SAVE_GUIDE_MAP_DISMISS_ERROR,
} from './constants';

const getUser = state => state.user.userId;
const getGuideMap = state => state.cases.guideMap;
const getStartLocation = state => state.cases.startLocation;

export function saveGuideMap(payload) {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: CASES_SAVE_GUIDE_MAP_BEGIN,
    payload,
  };
}

export function dismissSaveGuideMapError() {
  return {
    type: CASES_SAVE_GUIDE_MAP_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on CASES_SAVE_GUIDE_MAP_BEGIN actions
export function* doSaveGuideMap(action) {
  // If necessary, use argument to receive the begin action with parameters.
  let res;
  try {
    // 生成图片名
    const userId = yield select(getUser);
    const hashids = new Hashids(userId);
    const filename = hashids.encode(new Date().getTime());
    const guides = yield select(getGuideMap);
    const startLocation = yield select(getStartLocation);

    res = yield call(servicesWithSpin.asyncSaveGuideMap, {
      filename,
      guides,
      startLocation,
      ...action.payload,
    });

  } catch (err) {
    yield put({
      type: CASES_SAVE_GUIDE_MAP_FAILURE,
      data: { error: err },
    });
    return;
  }
  // Dispatch success action out of try/catch so that render errors are not catched.
  yield put({
    type: CASES_SAVE_GUIDE_MAP_SUCCESS,
    data: res,
  });

  message.success('选取成功');
}

/*
  Alternatively you may use takeEvery.

  takeLatest does not allow concurrent requests. If an action gets
  dispatched while another is already pending, that pending one is cancelled
  and only the latest one will be run.
*/
export function* watchSaveGuideMap() {
  yield takeLatest(CASES_SAVE_GUIDE_MAP_BEGIN, doSaveGuideMap);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case CASES_SAVE_GUIDE_MAP_BEGIN:
      return {
        ...state,
        saveGuideMapPending: true,
        saveGuideMapError: null,
      };

    case CASES_SAVE_GUIDE_MAP_SUCCESS:
      return {
        ...state,
        saveGuideMapPending: false,
        saveGuideMapError: null,
        guideMap: action.data,
      };

    case CASES_SAVE_GUIDE_MAP_FAILURE:
      return {
        ...state,
        saveGuideMapPending: false,
        saveGuideMapError: action.data.error,
      };

    case CASES_SAVE_GUIDE_MAP_DISMISS_ERROR:
      return {
        ...state,
        saveGuideMapError: null,
      };

    default:
      return state;
  }
}
