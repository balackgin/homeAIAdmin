// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import {
  SAMPLES_CLEAR_SAMPLE_FORM,
} from './constants';

export function clearSampleForm() {
  return {
    type: SAMPLES_CLEAR_SAMPLE_FORM,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case SAMPLES_CLEAR_SAMPLE_FORM:
      return {
        ...state,
        count: 0,
        curPage: 1,
        curStep: 0,
        cover: '',
        detailImage: '',
        keyword: '',
        caseList: [],
        curCase: {},
        curSample: {},
        roomList: [],
        curSampleId: null
      };

    default:
      return state;
  }
}
