// 对于rekit的扩展
import {getQueryParams} from '../../features/common/utils/';

const query = getQueryParams();
const role = query.role === 'pd' ? 'pd' : window.g_config.role;
const userId = window.g_config.userId;
const permittedRole = query.permittedRole || window.g_config.permittedRole;

export default function userReducer(state = { userId, role, permittedRole,  }, action) {
  switch (action.type) {
    // case 'USER_SETTINGS':
    //   return { ...state, ...action.payload.userInfo};
    default:
      return state;
  }
}
