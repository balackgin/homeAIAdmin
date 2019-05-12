// This is the root reducer of the feature. It is used for:
//   1. Load reducers from each action in the feature and process them one by one.
//      Note that this part of code is mainly maintained by Rekit, you usually don't need to edit them.
//   2. Write cross-topic reducers. If a reducer is not bound to some specific action.
//      Then it could be written here.
// Learn more from the introduction of this approach:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da.

import initialState from './initialState';
import { reducer as fetchSampleListReducer } from './fetchSampleList';
import { reducer as fetchCaseListReducer } from './fetchCaseList';
import { reducer as postSampleActionReducer } from './postSampleAction';
import { reducer as fetchCaseRenderDataReducer } from './fetchCaseRenderData';
import { reducer as saveRoomListReducer } from './saveRoomList';
import { reducer as saveCaseReducer } from './saveCase';
import { reducer as setStepReducer } from './setStep';
import { reducer as uploadImageReducer } from './uploadImage';
import { reducer as fetchSampleDetailReducer } from './fetchSampleDetail';
import { reducer as clearSampleFormReducer } from './clearSampleForm';
import { reducer as previewSampleReducer } from './previewSample';

const reducers = [
  fetchSampleListReducer,
  fetchCaseListReducer,
  postSampleActionReducer,
  fetchCaseRenderDataReducer,
  saveRoomListReducer,
  saveCaseReducer,
  setStepReducer,
  uploadImageReducer,
  fetchSampleDetailReducer,
  clearSampleFormReducer,
  previewSampleReducer,
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Handle cross-topic actions here
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
