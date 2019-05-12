// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import {
  SAMPLES_SET_STEP,
} from './constants';

export function setStep(step) {
  return {
    type: SAMPLES_SET_STEP,
    payload: step
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case SAMPLES_SET_STEP:
      return {
        ...state,
        curStep: action.payload
      };

    default:
      return state;
  }
}
