import initialState from './initialState';
import { reducer as fetchCityCodesReducer } from './fetchCityCodes';
import { reducer as userLoginoutReducer } from './userLoginout';
import { reducer as fetchUserInfoReducer } from './fetchUserInfo';
import { reducer as cancelBindPhoneDialogReducer } from './cancelBindPhoneDialog';

const reducers = [
  fetchCityCodesReducer,
  userLoginoutReducer,
  fetchUserInfoReducer,
  cancelBindPhoneDialogReducer,
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Handle cross-topic actions here
    case 'UPDATE_USERINFO':
      const { userInfo } = action.payload;
      return {...state, userInfo};
    case 'BIND_PHONE':
      newState = { 
        needBindPhone: true,
        bindPhoneMsg: action.payload
      };
      return {...state, ...newState};
    default:
      newState = state;
      break;
  }
  /* istanbul ignore next */
  return reducers.reduce((s, r) => r(s, action), newState);
}
