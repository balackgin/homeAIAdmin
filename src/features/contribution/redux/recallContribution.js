import { takeLatest, delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { showSuccessMsg, showErrorMsg} from '../../common/redux/actions';
import {
  CONTRIBUTION_RECALL_CONTRIBUTION_BEGIN,
  CONTRIBUTION_RECALL_CONTRIBUTION_SUCCESS,
  CONTRIBUTION_RECALL_CONTRIBUTION_FAILURE,
  CONTRIBUTION_RECALL_CONTRIBUTION_DISMISS_ERROR,
} from './constants';

import {
  recallConStatus,
  // getContributions,
  // getCounts
} from '../service.js'

// const defaultStatus = state => state.contribution.status;
// const defaultPage = state => state.contribution.curPage;
// const defaultKeyword = state => state.contribution.keyword;
// const defaultSize = state => state.contribution.size;

export function recallContribution(sampleId, cb) {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: CONTRIBUTION_RECALL_CONTRIBUTION_BEGIN,
    sampleId,
    cb,
  };
}

export function dismissRecallContributionError() {
  return {
    type: CONTRIBUTION_RECALL_CONTRIBUTION_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on CONTRIBUTION_RECALL_CONTRIBUTION_BEGIN actions
export function* doRecallContribution(params) {
  // If necessary, use argument to receive the begin action with parameters.
  try {
    // Do Ajax call or other async request here. delay(20) is just a placeholder.
    const { sampleId, cb } = params;
    yield call(recallConStatus, sampleId);

    yield put(showSuccessMsg('已撤回'))
    yield delay(500);
    
    cb && cb();
    // const status = yield select(defaultStatus);
    // const page = yield select(defaultPage);
    // const keyword = yield select(defaultKeyword);
    // const size = yield select(defaultSize);

    // yield call(getCounts, keyword);
    // yield call(getContributions, { status, size, page, keyword });
    

  } catch (err) {
    yield put(showErrorMsg('撤回失败'))
    yield put({
      type: CONTRIBUTION_RECALL_CONTRIBUTION_FAILURE,
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
export function* watchRecallContribution() {
  yield takeLatest(CONTRIBUTION_RECALL_CONTRIBUTION_BEGIN, doRecallContribution);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case CONTRIBUTION_RECALL_CONTRIBUTION_BEGIN:
      return {
        ...state,
        recallContributionPending: true,
        recallContributionError: null,
      };

    case CONTRIBUTION_RECALL_CONTRIBUTION_SUCCESS:
      return {
        ...state,
        recallContributionPending: false,
        recallContributionError: null,
      };

    case CONTRIBUTION_RECALL_CONTRIBUTION_FAILURE:
      return {
        ...state,
        recallContributionPending: false,
        recallContributionError: action.data.error,
      };

    case CONTRIBUTION_RECALL_CONTRIBUTION_DISMISS_ERROR:
      return {
        ...state,
        recallContributionError: null,
      };

    default:
      return state;
  }
}
