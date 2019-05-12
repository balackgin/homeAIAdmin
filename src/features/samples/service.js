import axios from 'axios';
import { get } from '../../common/core/request';
import { host, BUCKET_NAME, OSS_HOST } from '../common/utils/';

export async function asyncFetchCaseRenderData(caseId) {
  const res = await get(`${host}/api/case/queryCaseRenderData?`, { caseId });

  return res;
}

export async function asyncUploadOSS(ossHost, payload) {
  const config = { headers: { 'Content-Type': 'multipart/form-data' } };
  const data = new FormData();
  for (const key in payload) {
    data.append(key, payload[key]);
  }

  return axios.post(ossHost, data, config)
  .then(() => {
    return payload.key;
  })
  .catch(errors => {
    throw new Error('图片上传失败');
  });
}

export async function asyncUploadImage(payload) {
  const { data } = await get(`${host}/api/oss/sign`);
  // const { accessId, policy, signature, host, cdnPrefix } = data;
  const { accessId, policy, signature } = data;
  const filename = payload.filename;

  // step2：上传图片至oss
  const imageUrl = await asyncUploadOSS(OSS_HOST, {
    key: `${BUCKET_NAME}/${filename}.png`,
    policy,
    signature,
    OSSAccessKeyId: accessId,
    success_action_status : '200',
    file: new File([payload.data], `${filename}.png`),
  });
  return `${imageUrl}`;
}