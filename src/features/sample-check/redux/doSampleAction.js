import { takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { showErrorMsg} from '../../common/redux/actions';
import history from '../../../common/history';
import {
  SAMPLE_CHECK_DO_SAMPLE_ACTION_BEGIN,
  SAMPLE_CHECK_DO_SAMPLE_ACTION_SUCCESS,
  SAMPLE_CHECK_DO_SAMPLE_ACTION_FAILURE,
  SAMPLE_CHECK_DO_SAMPLE_ACTION_DISMISS_ERROR,
} from './constants';
import { servicesWithSpin } from '../service';

export function doSampleAction(id, actionType, reason) {

  // If need to pass args to saga, pass it with the begin action.
  return {
    type: SAMPLE_CHECK_DO_SAMPLE_ACTION_BEGIN,
    payload: {
      id,
      actionType,
      reason
    }
  };
}

export function dismissDoSampleActionError() {
  return {
    type: SAMPLE_CHECK_DO_SAMPLE_ACTION_DISMISS_ERROR,
  };
}

export function* doDoSampleAction(action) {
  const { id, actionType, reason } = action.payload;
  try {
    // Do Ajax call or other async request here. delay(20) is just a placeholder.
    yield call(servicesWithSpin.asyncDoSampleCheck, id, actionType, reason);

    history.goBack();
  } catch (err) {
    // yield put(showErrorMsg(`${statusMap[actionType]}失败`))
    yield put({
      type: SAMPLE_CHECK_DO_SAMPLE_ACTION_FAILURE,
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
export function* watchDoSampleAction() {
  yield takeLatest(SAMPLE_CHECK_DO_SAMPLE_ACTION_BEGIN, doDoSampleAction);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case SAMPLE_CHECK_DO_SAMPLE_ACTION_BEGIN:
      return {
        ...state,
        doSampleActionPending: true,
        doSampleActionError: null,
      };

    case SAMPLE_CHECK_DO_SAMPLE_ACTION_SUCCESS:
      return {
        ...state,
        doSampleActionPending: false,
        doSampleActionError: null,
      };

    case SAMPLE_CHECK_DO_SAMPLE_ACTION_FAILURE:
      return {
        ...state,
        doSampleActionPending: false,
        doSampleActionError: action.data.error,
      };

    case SAMPLE_CHECK_DO_SAMPLE_ACTION_DISMISS_ERROR:
      return {
        ...state,
        doSampleActionError: null,
      };

    default:
      return state;
  }
}
