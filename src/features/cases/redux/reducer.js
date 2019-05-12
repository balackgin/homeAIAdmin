// This is the root reducer of the feature. It is used for:
//   1. Load reducers from each action in the feature and process them one by one.
//      Note that this part of code is mainly maintained by Rekit, you usually don't need to edit them.
//   2. Write cross-topic reducers. If a reducer is not bound to some specific action.
//      Then it could be written here.
// Learn more from the introduction of this approach:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da.

import initialState from './initialState';
import { reducer as deleteCaseReducer } from './deleteCase';
import { reducer as fetchCasesReducer } from './fetchCases';
import { reducer as fetchQuotationReducer } from './fetchQuotation';
import { reducer as clearQuotationReducer } from './clearQuotation';
import { reducer as saveCoverReducer } from './saveCover';
import { reducer as saveGuideMapReducer } from './saveGuideMap';
import { reducer as clearEditDataReducer } from './clearEditData';
import { reducer as fetchCaseRenderDataReducer } from './fetchCaseRenderData';
import { reducer as addTagReducer } from './addTag';
import { reducer as removeTagReducer } from './removeTag';
import { reducer as fetchItemListReducer } from './fetchItemList';
import { reducer as updateGuideMapReducer } from './updateGuideMap';

const reducers = [
  deleteCaseReducer,
  fetchCasesReducer,
  fetchQuotationReducer,
  clearQuotationReducer,
  saveCoverReducer,
  saveGuideMapReducer,
  clearEditDataReducer,
  fetchCaseRenderDataReducer,
  addTagReducer,
  removeTagReducer,
  fetchItemListReducer,
  updateGuideMapReducer,
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
