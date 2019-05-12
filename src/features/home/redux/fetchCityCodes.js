import { takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import {
  HOME_FETCH_CITY_CODES_BEGIN,
  HOME_FETCH_CITY_CODES_SUCCESS,
  HOME_FETCH_CITY_CODES_FAILURE,
  HOME_FETCH_CITY_CODES_DISMISS_ERROR,
} from './constants';
import { getCityCodes } from '../api';
import storage from '../../common/utils/storage';

export function fetchCityCodes() {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: HOME_FETCH_CITY_CODES_BEGIN,
  };
}

export function dismissFetchCityCodesError() {
  return {
    type: HOME_FETCH_CITY_CODES_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on HOME_FETCH_CITY_CODES_BEGIN actions
export function* doFetchCityCodes() {
  // If necessary, use argument to receive the begin action with parameters.
  try {
    // Do Ajax call or other async request here. delay(20) is just a placeholder.
    const cityCodes = yield call(getCityCodes);
    storage.setItem('cityCodes', cityCodes);
    yield put({
      type: HOME_FETCH_CITY_CODES_SUCCESS,
      payload: cityCodes
    });
  } catch (err) {
    yield put({
      type: HOME_FETCH_CITY_CODES_FAILURE,
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
export function* watchFetchCityCodes() {
  yield takeLatest(HOME_FETCH_CITY_CODES_BEGIN, doFetchCityCodes);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case HOME_FETCH_CITY_CODES_BEGIN:
      return {
        ...state,
        fetchCityCodesPending: true,
        fetchCityCodesError: null,
      };

    case HOME_FETCH_CITY_CODES_SUCCESS:
      return {
        ...state,
        fetchCityCodesPending: false,
        fetchCityCodesError: null,
        cityCodes: action.payload
      };

    case HOME_FETCH_CITY_CODES_FAILURE:
      return {
        ...state,
        fetchCityCodesPending: false,
        fetchCityCodesError: action.data.error,
      };

    case HOME_FETCH_CITY_CODES_DISMISS_ERROR:
      return {
        ...state,
        fetchCityCodesError: null,
      };

    default:
      return state;
  }
}
