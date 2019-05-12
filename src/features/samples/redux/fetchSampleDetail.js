import { takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import {
  SAMPLES_FETCH_SAMPLE_DETAIL_BEGIN,
  SAMPLES_FETCH_SAMPLE_DETAIL_SUCCESS,
  SAMPLES_FETCH_SAMPLE_DETAIL_FAILURE,
  SAMPLES_FETCH_SAMPLE_DETAIL_DISMISS_ERROR,
} from './constants';
import { getSampleDetail } from '../api';

export function fetchSampleDetail(id, cb) {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: SAMPLES_FETCH_SAMPLE_DETAIL_BEGIN,
    payload: {
      id
    },
    cb
  };
}

export function dismissFetchSampleDetailError() {
  return {
    type: SAMPLES_FETCH_SAMPLE_DETAIL_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on SAMPLES_FETCH_SAMPLE_DETAIL_BEGIN actions
export function* doFetchSampleDetail(action) {
  // If necessary, use argument to receive the begin action with parameters.
  try {
    // Do Ajax call or other async request here. delay(20) is just a placeholder.
    const { sampleData, caseData } = yield call(getSampleDetail, action.payload.id);
    yield put({
      type: SAMPLES_FETCH_SAMPLE_DETAIL_SUCCESS,
      payload: {
        sampleData,
        caseData
      }
    });
    action.cb && action.cb({ sampleData, caseData });
  } catch (err) {
    yield put({
      type: SAMPLES_FETCH_SAMPLE_DETAIL_FAILURE,
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
export function* watchFetchSampleDetail() {
  yield takeLatest(SAMPLES_FETCH_SAMPLE_DETAIL_BEGIN, doFetchSampleDetail);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case SAMPLES_FETCH_SAMPLE_DETAIL_BEGIN:
      return {
        ...state,
        fetchSampleDetailPending: true,
        fetchSampleDetailError: null,
      };

    case SAMPLES_FETCH_SAMPLE_DETAIL_SUCCESS:
      const {
        sampleData: {
          coverList: {
            cover,
            detailImage
          }
        },
        sampleData,
        caseData
      } = action.payload;
      return {
        ...state,
        fetchSampleDetailPending: false,
        fetchSampleDetailError: null,
        curSample: sampleData,
        cover: cover,
        detailImage: detailImage,
        curCase: caseData
      };

    case SAMPLES_FETCH_SAMPLE_DETAIL_FAILURE:
      return {
        ...state,
        fetchSampleDetailPending: false,
        fetchSampleDetailError: action.data.error,
      };

    case SAMPLES_FETCH_SAMPLE_DETAIL_DISMISS_ERROR:
      return {
        ...state,
        fetchSampleDetailError: null,
      };

    default:
      return state;
  }
}
