import { getUserInfo } from './api';
import { spinWrapper } from '../../common/core/wrapper';

// const DEFAULT_AVATAR = '//ossgw.alicdn.com/homeai/homeai_fe_daily/r8A7gO4zw.png?x-oss-process=image/resize,w_400';

export async function fetchUserInfo() {
  const userInfo = await getUserInfo();
  userInfo.avatar = userInfo.information.avatar;
  userInfo.nick = userInfo.information.nick;
  // if (!userInfo.avatar) {
  //   userInfo.avatar = DEFAULT_AVATAR;
  // }
  userInfo.cityCodes = userInfo.districtCodes;
  delete userInfo['districtCodes'];
  delete userInfo['information'];
  return userInfo;
}

export const servicesWithSpin = {
  fetchUserInfo: spinWrapper(fetchUserInfo)
};