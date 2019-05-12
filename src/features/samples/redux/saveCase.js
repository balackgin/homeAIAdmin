// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import {
  SAMPLES_SAVE_CASE,
} from './constants';

export function saveCase(caseInfo) {
  return {
    type: SAMPLES_SAVE_CASE,
    payload: caseInfo
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case SAMPLES_SAVE_CASE:
      const curCase = action.payload;
      return {
        ...state,
        curCase: curCase || {}
      };

    default:
      return state;
  }
}
