import { delay, takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import {
  SAMPLES_POST_SAMPLE_ACTION_BEGIN,
  SAMPLES_POST_SAMPLE_ACTION_SUCCESS,
  SAMPLES_POST_SAMPLE_ACTION_FAILURE,
  SAMPLES_POST_SAMPLE_ACTION_DISMISS_ERROR,
} from './constants';
import { postSample as asyncPostSample, saveSample, deleteSample } from '../api';
import { fetchSampleList } from './fetchSampleList';
import history from '../../../common/history';
import { showSuccessMsg, showWarningMsg } from '../../common/redux/actions';

const getRoomList = state => state.samples.roomList;
const getCaseId = state => state.samples.curCase.id;
const getCover = state => state.samples.cover;
const getDetailImage = state => state.samples.detailImage;

export function postSampleAction(data, type) {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: SAMPLES_POST_SAMPLE_ACTION_BEGIN,
    payload: {
      data,
      type
    }
  };
}

export function dismissPostSampleActionError() {
  return {
    type: SAMPLES_POST_SAMPLE_ACTION_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on SAMPLES_POST_SAMPLE_BEGIN actions
export function* doPostSampleAction({payload}) {
  // If necessary, use argument to receive the begin action with parameters.
  try {
    const roomList = yield select(getRoomList);
    const caseId = yield select(getCaseId);
    const coverList = {
      cover: yield select(getCover),
      detailImage: yield select(getDetailImage)
    }
    const sampleInfo = {
      ...payload.data,
      caseId: Number(caseId),
      roomList,
      coverList
    }

    if (payload.type === 'save') {
      if (!coverList.cover) {
        yield put(showWarningMsg('请上传封面图'));
        return;
      } else if (!caseId) {
        yield put(showWarningMsg('请关联方案'));
        return;
      }
      const id = yield call(saveSample, sampleInfo);
      yield put({
        type: SAMPLES_POST_SAMPLE_ACTION_SUCCESS,
        payload: id
      })
      yield delay(500);
      history.goBack();
    } else if (payload.type === 'both') {
      if (!coverList.cover) {
        yield put(showWarningMsg('请上传封面图'));
        return;
      } else if (!caseId) {
        yield put(showWarningMsg('请关联方案'));
        return;
      }
      const id = yield call(saveSample, sampleInfo);
      yield put({
        type: SAMPLES_POST_SAMPLE_ACTION_SUCCESS,
        payload: id
      })
      yield call(asyncPostSample, id);
      yield delay(500);
      yield put(showSuccessMsg('保存并投稿成功'));
      history.goBack();
    } else if (payload.type === 'post') {
      yield call(asyncPostSample, payload.data);
      yield delay(500);
      yield put(showSuccessMsg('投稿成功'));
      yield put(fetchSampleList(1));
    } else if (payload.type === 'delete') {
      yield call(deleteSample, payload.data);
      yield delay(1000);
      yield put(showSuccessMsg('删除成功'));
      yield put(fetchSampleList(1));
    } else if (payload.type === 'preview') {
      const id = yield call(saveSample, sampleInfo);
      yield put({
        type: SAMPLES_POST_SAMPLE_ACTION_SUCCESS,
        payload: id
      })
    }
  } catch (err) {
    yield put({
      type: SAMPLES_POST_SAMPLE_ACTION_FAILURE,
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
export function* watchPostSampleAction() {
  yield takeLatest(SAMPLES_POST_SAMPLE_ACTION_BEGIN, doPostSampleAction);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case SAMPLES_POST_SAMPLE_ACTION_BEGIN:
      return {
        ...state,
        postSampleActionPending: true,
        postSampleActionError: null,
      };

    case SAMPLES_POST_SAMPLE_ACTION_SUCCESS:
      return {
        ...state,
        postSampleActionPending: false,
        postSampleActionError: null,
        curSampleId: action.payload
      };

    case SAMPLES_POST_SAMPLE_ACTION_FAILURE:
      return {
        ...state,
        postSampleActionPending: false,
        postSampleActionError: action.data.error,
      };

    case SAMPLES_POST_SAMPLE_ACTION_DISMISS_ERROR:
      return {
        ...state,
        postSampleActionError: null,
      };

    default:
      return state;
  }
}
