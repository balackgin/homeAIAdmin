import Hashids from 'hashids';
import { takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { showSuccessMsg } from '../../common/redux/actions';
import { servicesWithSpin } from '../service';
import {
  CASES_SAVE_COVER_BEGIN,
  CASES_SAVE_COVER_SUCCESS,
  CASES_SAVE_COVER_FAILURE,
  CASES_SAVE_COVER_DISMISS_ERROR,
} from './constants';

const getUser = state => state.user.userId;
const getGuideMap = state => state.cases.guideMap;

export function saveCover(payload) {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: CASES_SAVE_COVER_BEGIN,
    payload,
  };
}

export function dismissSaveCoverError() {
  return {
    type: CASES_SAVE_COVER_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on CASES_SAVE_COVER_BEGIN actions
export function* doSaveCover(action) {
  let res = '';
  try {
    const userId = yield select(getUser);
    const hashids = new Hashids(userId);
    const filename = hashids.encode(new Date().getTime());
    const guides = yield select(getGuideMap);

    res = yield call(servicesWithSpin.asyncUpdateCase, {
      filename,
      guides,
      ...action.payload,
    });
  } catch (err) {
    yield put({
      type: CASES_SAVE_COVER_FAILURE,
      data: { error: err },
    });
    return;
  }

  yield put({
    type: CASES_SAVE_COVER_SUCCESS,
    data: res,
  });

  yield put(showSuccessMsg('选取成功'));
}

/*
  Alternatively you may use takeEvery.

  takeLatest does not allow concurrent requests. If an action gets
  dispatched while another is already pending, that pending one is cancelled
  and only the latest one will be run.
*/
export function* watchSaveCover() {
  yield takeLatest(CASES_SAVE_COVER_BEGIN, doSaveCover);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case CASES_SAVE_COVER_BEGIN:
      return {
        ...state,
        saveCoverPending: true,
        saveCoverError: null,
      };

    case CASES_SAVE_COVER_SUCCESS:
      return {
        ...state,
        saveCoverPending: false,
        saveCoverError: null,
        startLocation: action.data.startLocation,
        guideMap: action.data.guideMap,
      };

    case CASES_SAVE_COVER_FAILURE:
      return {
        ...state,
        saveCoverPending: false,
        saveCoverError: action.data.error,
      };

    case CASES_SAVE_COVER_DISMISS_ERROR:
      return {
        ...state,
        saveCoverError: null,
      };

    default:
      return state;
  }
}
