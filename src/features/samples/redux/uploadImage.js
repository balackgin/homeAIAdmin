import Hashids from 'hashids';
import { takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import {
  SAMPLES_UPLOAD_IMAGE_BEGIN,
  SAMPLES_UPLOAD_IMAGE_SUCCESS,
  SAMPLES_UPLOAD_IMAGE_FAILURE,
  SAMPLES_UPLOAD_IMAGE_DISMISS_ERROR,
} from './constants';

import { asyncUploadImage } from '../service';

const getUser = state => state.user.userId;

export function uploadImage(payload, cb) {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: SAMPLES_UPLOAD_IMAGE_BEGIN,
    payload,
    cb
  };
}

export function dismissUploadImageError() {
  return {
    type: SAMPLES_UPLOAD_IMAGE_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on SAMPLES_UPLOAD_IMAGE_BEGIN actions
export function* doUploadImage(action) {
  // If necessary, use argument to receive the begin action with parameters.
  try {
    const userId = yield select(getUser);
    const hashids = new Hashids(userId);
    const filename = hashids.encode(new Date().getTime());

    const imageUrl = yield call(asyncUploadImage, {
      filename,
      ...action.payload,
    });
    action.cb && action.cb(imageUrl);
    yield put({
      type: SAMPLES_UPLOAD_IMAGE_SUCCESS,
      data: {
        url: imageUrl,
        type: action.payload.type
      },
    });
  } catch (err) {
    yield put({
      type: SAMPLES_UPLOAD_IMAGE_FAILURE,
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
export function* watchUploadImage() {
  yield takeLatest(SAMPLES_UPLOAD_IMAGE_BEGIN, doUploadImage);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case SAMPLES_UPLOAD_IMAGE_BEGIN:
      return {
        ...state,
        uploadImagePending: true,
        uploadImageError: null,
      };

    case SAMPLES_UPLOAD_IMAGE_SUCCESS:
      const { url, type } = action.data;
      return {
        ...state,
        uploadImagePending: false,
        uploadImageError: null,
        [type]: url
      };

    case SAMPLES_UPLOAD_IMAGE_FAILURE:
      return {
        ...state,
        uploadImagePending: false,
        uploadImageError: action.data.error,
      };

    case SAMPLES_UPLOAD_IMAGE_DISMISS_ERROR:
      return {
        ...state,
        uploadImageError: null,
      };

    default:
      return state;
  }
}
