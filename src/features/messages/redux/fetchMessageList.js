import { takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import {
  MESSAGES_FETCH_MESSAGE_LIST_BEGIN,
  MESSAGES_FETCH_MESSAGE_LIST_SUCCESS,
  MESSAGES_FETCH_MESSAGE_LIST_FAILURE,
  MESSAGES_FETCH_MESSAGE_LIST_DISMISS_ERROR,
} from './constants';
import {
  getMessageList
} from '../service';

export function fetchMessageList(type, page) {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: MESSAGES_FETCH_MESSAGE_LIST_BEGIN,
    payload: {
      type,
      page
    }
  };
}

export function dismissFetchMessageListError() {
  return {
    type: MESSAGES_FETCH_MESSAGE_LIST_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on MESSAGE_FETCH_MESSAGE_LIST_BEGIN actions
export function* doFetchMessageList({ payload }) {
  // If necessary, use argument to receive the begin action with parameters.
  try {
    const { type, page } = payload;
    const size = 10;
    const data = yield call(getMessageList, type, page, size);
    yield put({
      type: MESSAGES_FETCH_MESSAGE_LIST_SUCCESS,
      data
    });
  } catch (err) {
    yield put({
      type: MESSAGES_FETCH_MESSAGE_LIST_FAILURE,
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
export function* watchFetchMessageList() {
  yield takeLatest(MESSAGES_FETCH_MESSAGE_LIST_BEGIN, doFetchMessageList);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case MESSAGES_FETCH_MESSAGE_LIST_BEGIN:
      const { type, page } = action.payload;
      return {
        ...state,
        fetchMessageListPending: true,
        fetchMessageListError: null,
        type,
        [`${type}CurPage`]: page
      };

    case MESSAGES_FETCH_MESSAGE_LIST_SUCCESS:
      const { recordList, totalCount } = action.data;
      return {
        ...state,
        fetchMessageListPending: false,
        fetchMessageListError: null,
        messageList: recordList,
        totalCount
      };

    case MESSAGES_FETCH_MESSAGE_LIST_FAILURE:
      return {
        ...state,
        fetchMessageListPending: false,
        fetchMessageListError: action.data.error,
      };

    case MESSAGES_FETCH_MESSAGE_LIST_DISMISS_ERROR:
      return {
        ...state,
        fetchMessageListError: null,
      };

    default:
      return state;
  }
}
