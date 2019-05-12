import { takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import {
  SAMPLES_PREVIEW_SAMPLE_BEGIN,
  SAMPLES_PREVIEW_SAMPLE_SUCCESS,
  SAMPLES_PREVIEW_SAMPLE_FAILURE,
  SAMPLES_PREVIEW_SAMPLE_DISMISS_ERROR,
} from './constants';
import storage from '../../common/utils/storage';
import { getUserInfo } from '../api';

const getDetailImage = state => state.samples.detailImage;
const getRoomList = state => state.samples.roomList;
const getCurCase = state => state.samples.curCase;

export function previewSample(formData, previewPage) {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: SAMPLES_PREVIEW_SAMPLE_BEGIN,
    payload: {
      formData,
      previewPage
    }
  };
}

export function dismissPreviewSampleError() {
  return {
    type: SAMPLES_PREVIEW_SAMPLE_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on SAMPLES_PREVIEW_SAMPLE_BEGIN actions
export function* doPreviewSample({ payload }) {
  // If necessary, use argument to receive the begin action with parameters.
  try {
    const roomList = yield select(getRoomList);
    const detailImage = yield select(getDetailImage);
    const curCase = yield select(getCurCase);
    const {
      id,
      birdsEyeView: {
        imgUrl,
        link
      } = {},
      houseInfo: {
        address,
        area,
        cityName,
        roomCount
      } = {}
    } = curCase;
    // Do Ajax call or other async request here. delay(20) is just a placeholder.
    const { formData, previewPage } = payload;
    const { cityCodes, maxPrice, minPrice, styles } = yield call(getUserInfo);
    const previewData = {
      data: {
        designer: {
          cityCodeList: cityCodes,
          maxPrice,
          minPrice,
          styleList: styles,
        },
        sample: {
          address,
          area,
          birdsEyeImage: imgUrl,
          caseId: id,
          cityName,
          detailImage,
          roomCount,
          roomList: roomList.map(roomItem => {
            return {
              ...roomItem,
              pano: link && link.find(linkItem => linkItem.roomIdx === roomItem.roomIdx).pano
            }
          }),
          ...formData
        }
      }
    };
    storage.setItem('previewData', previewData);
    previewPage.location.href = '/preview.html?preview_blank=true';
  } catch (err) {
    yield put({
      type: SAMPLES_PREVIEW_SAMPLE_FAILURE,
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
export function* watchPreviewSample() {
  yield takeLatest(SAMPLES_PREVIEW_SAMPLE_BEGIN, doPreviewSample);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case SAMPLES_PREVIEW_SAMPLE_BEGIN:
      return {
        ...state,
        previewSamplePending: true,
        previewSampleError: null,
      };

    case SAMPLES_PREVIEW_SAMPLE_SUCCESS:
      return {
        ...state,
        previewSamplePending: false,
        previewSampleError: null,
      };

    case SAMPLES_PREVIEW_SAMPLE_FAILURE:
      return {
        ...state,
        previewSamplePending: false,
        previewSampleError: action.data.error,
      };

    case SAMPLES_PREVIEW_SAMPLE_DISMISS_ERROR:
      return {
        ...state,
        previewSampleError: null,
      };

    default:
      return state;
  }
}
