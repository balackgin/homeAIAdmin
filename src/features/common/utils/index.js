import OSS from './oss';
import appApiHost from './appApiHost';

export function getQueryParams(req) {
  const theRequest = {};
  let url = window.location.search;
  const strs = url.indexOf('?') !== -1 ?
    url.substr(1).split('&') :
    url.split('&');

  for (var i = 0; i < strs.length; i++) {
    const str = strs[i];
    let [key, val] = str.split('=');
    theRequest[key] = val;
  }

  return theRequest;
}

export function timeFormatter(timeStamps) {
  const time = new Date(timeStamps);
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const date = time.getDate();
  const hour = time.getHours();
  const minute = time.getMinutes();
  return `${year}-${month}-${date} ${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute}`;
}

export const BUCKET_NAME = OSS.bucketName;
export const OSS_HOST = OSS.endpoint;
export const OSS_PREFIX = OSS.cdn;
export const host = appApiHost;

export function getCDNimage(fileName = '', width) {
  // TODO: 判断是否可以支持webp格式
  if (width) {
    return `${OSS_PREFIX}${fileName}?x-oss-process=image/resize,w_${width}`;
  } else {
    return `${OSS_PREFIX}${fileName}`;
  }
}
