import { takeLatest, delay } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { showSuccessMsg, showErrorMsg} from '../../common/redux/actions';
import {
  OPERATOR_OPERATE_CASES_BEGIN,
  OPERATOR_OPERATE_CASES_SUCCESS,
  OPERATOR_OPERATE_CASES_FAILURE,
  OPERATOR_OPERATE_CASES_DISMISS_ERROR,
} from './constants';
import { getOperations } from './getOperations'

import {
  deleteCase
} from '../service'
const pageInStore = state => state.operator.page;
const statusInStore = state => state.operator.status;
const keywordInStore = state => state.operator.keyword;

export function operateCases(payload) {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: OPERATOR_OPERATE_CASES_BEGIN,
    payload
  };
}

export function dismissOperateCasesError() {
  return {
    type: OPERATOR_OPERATE_CASES_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on OPERATOR_DELETE_CASES_BEGIN actions
export function* doOperateCases(params) {
  // If necessary, use argument to receive the begin action with parameters.
  let res;
  try {
    // Do Ajax call or other async request here. delay(20) is just a placeholder.
    const { sampleId, action } = params.payload;
    const titleMap = {
      online: '上线案例',
      offline: '下线案例',
      delete: '删除案例'
    }
    const page = yield select(pageInStore);
    const status = yield select(statusInStore);
    const keyword = yield select(keywordInStore);
  
   res = yield call(deleteCase, { sampleId, action });
    
   yield put(showSuccessMsg(`已${titleMap[action]}`));
   yield put({
     type: OPERATOR_OPERATE_CASES_SUCCESS,
       data: res,
     });
   yield delay(1000);
   yield put(getOperations({page, status, keyword, size: 12}));
  } catch (err) {
    yield put(showErrorMsg('下架失败'));
    yield put({
      type: OPERATOR_OPERATE_CASES_FAILURE,
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
export function* watchOperateCases() {
  yield takeLatest(OPERATOR_OPERATE_CASES_BEGIN, doOperateCases);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case OPERATOR_OPERATE_CASES_BEGIN:
      return {
        ...state,
        operateCasesPending: true,
        operateCasesError: null,
      };

    case OPERATOR_OPERATE_CASES_SUCCESS:
      return {
        ...state,
        operateCasesPending: false,
        operateCasesError: null,
      };

    case OPERATOR_OPERATE_CASES_FAILURE:
      return {
        ...state,
        operateCasesPending: false,
        operateCasesError: action.data.error,
      };

    case OPERATOR_OPERATE_CASES_DISMISS_ERROR:
      return {
        ...state,
        operateCasesError: null,
      };

    default:
      return state;
  }
}
