import { getCDNimage } from './';

const DEFAULT_AVATAR = '//ossgw.alicdn.com/homeai/homeai_fe_daily/r8A7gO4zw.png?x-oss-process=image/resize,w_400';

const getAvatarUrl = (avatarSrc, width=60) => {
  return avatarSrc ? getCDNimage(avatarSrc, width) : DEFAULT_AVATAR;
}

export default getAvatarUrl;