import axios from 'axios';
import { spinWrapper } from '../../common/core/wrapper';
import { get, post } from '../../common/core/request';
import { BUCKET_NAME, OSS_HOST, host } from '../common/utils/';

export async function asyncFetchCases(page, size) {
  const { cases: list, count = 0 } = await get(`${host}/api/case/queryCases?`, { page, size });

  return {
    list: list || [],
    total: count,
    current: page,
  }
}

export async function asyncDeleteCase(caseId) {
  const res = await post(`${host}/api/case/deleteCase?`, { caseId });

  return res;
}

export async function asyncFetchQuotation(id) {
  const {
    total_price: total, // 合同总价
    per_meter_price: perMeter, // 每平米单价
    hard_loading, // 硬装明细
    hard_loading_price, // 硬装总价
    hard_loading_outline, // 硬装概览
    soft_wear, // 软装明细
    soft_wear_price, // 软装总价
    soft_wear_outline, // 软装概览
    customer, // 客户信息
    location, // 小区信息
  } = await get(`${host}/api/designer/quotation/id?`, { id });

  // TODO: 容错@remy
  return {
    general: {
      total,
      perMeter,
      customer,
      location,
      hard_loading: hard_loading_price,
      soft_wear: soft_wear_price,
    },
    hard_loading: {
      outline: hard_loading_outline || [],
      rooms: hard_loading.rooms || [],
    },
    soft_wear: {
      outline: soft_wear_outline || [],
      rooms: soft_wear.rooms || [],
    },
  };
}

export async function asyncFetchCaseRenderData(caseId) {
  const res = await get(`${host}/api/case/queryCaseRenderData?`, { caseId });

  return res;
}

export async function asyncUploadOSS(host, payload) {
  const config = { headers: { 'Content-Type': 'multipart/form-data' } };
  const data = new FormData();
  for (const key in payload) {
    data.append(key, payload[key]);
  }

  return axios.post(host, data, config)
  .then(() => {
    return payload.key;
  })
  .catch(errors => {
    throw new Error('图片上传失败');
  });
}

/**
 * 更新起始点封面图
 * @param {object} payload 
 */
export async function asyncUpdateCase(payload) {
  // step1：获取OSS签名等信息
  const { data } = await get(`${host}/api/oss/sign`);
  // const { accessId, policy, signature, host, cdnPrefix } = data;
  const { accessId, policy, signature } = data;
  const filename = payload.filename;

  // step2：上传图片至oss
  const coverUrl = await asyncUploadOSS(OSS_HOST, {
    key: `${BUCKET_NAME}/${filename}.png`,
    policy,
    signature,
    OSSAccessKeyId: accessId,
    success_action_status : '200',
    file: new File([payload.data], `${filename}.png`),
  });
  // step3：图片信息同步至db更新case
  await post(`${host}/api/case/updateCase`, {
    caseId: payload.id,
    name: payload.name || '',
    cover: coverUrl,
  });
  // step4：保存为一张guidemap
  const newGuideMap = {
    title: '',
    locationId: payload.locationId,
    coverImageUrl: coverUrl,
    showWay: 0,
    tourGuideType: 1, // 0:导览图  1:起始点封面
    eyeRay: {
      position: [0, 0, 0],
      quaternion: payload.eyeRay,
    },
  };
  // 将封面图和导览图数据进行合并之后再上传更新
  const newGuides = payload.guides.concat(newGuideMap);

  await post(`${host}/api/admin/guide/save`, {
    token: payload.token,
    guides: JSON.stringify(newGuides),
  });

  // 但是回传的时候依然要保持导览图原有的数据，否则会对导览图数据有污染
  return {
    startLocation: newGuideMap,
    guideMap: payload.guides,
  };
}

export async function asyncSaveGuideMap(payload) {
  // step1：获取OSS签名等信息
  const { data } = await get(`${host}/api/oss/sign`);
  // const { accessId, policy, signature, host, cdnPrefix } = data;
  const { accessId, policy, signature } = data;
  const filename = payload.filename;

  // step2：上传图片至oss
  const coverUrl = await asyncUploadOSS(OSS_HOST, {
    key: `${BUCKET_NAME}/${filename}.png`,
    policy,
    signature,
    OSSAccessKeyId: accessId, 
    success_action_status : '200',
    file: new File([payload.data], `${filename}.png`),
  });

  const newGuideMap = {
    title: `导览图${payload.guides.length + 1}`,
    locationId: payload.locationId,
    coverImageUrl: coverUrl,
    showWay: 0,
    tourGuideType: 0, // 0:导览图  1:起始点封面
    eyeRay: {
      position: [0, 0, 0],
      quaternion: payload.eyeRay,
    },
  };

  const onlyGuides = payload.guides.concat(newGuideMap);
  const allGuides = onlyGuides.concat(payload.startLocation);

  // step3：保存导览图，需要将原有的导览图concat新导览图数据
  await post(`${host}/api/admin/guide/save`, {
    token: payload.token,
    guides: JSON.stringify(allGuides),
  });

  return onlyGuides;
}

export async function asyncAddTag(payload) {
  const res = await post(`${host}/api/admin/tag/add`, payload);

  return res;
}

export async function asyncRemoveTag(payload) {
  const res = await get(`${host}/api/admin/tag/rm`, payload);

  return res;
}

export async function asyncUpdateGuideMapName(payload) {
  const guides = payload.guides.concat(payload.startLocation);
  await post(`${host}/api/admin/guide/save`, {
    token: payload.token,
    guides: JSON.stringify(guides),
  });

  return payload.guides;
}

export const servicesWithSpin = {
  asyncFetchCases: spinWrapper(asyncFetchCases),
  asyncDeleteCase: spinWrapper(asyncDeleteCase),
  asyncFetchQuotation: spinWrapper(asyncFetchQuotation),
  asyncUpdateCase: spinWrapper(asyncUpdateCase),
  asyncFetchCaseRenderData: spinWrapper(asyncFetchCaseRenderData),
  asyncSaveGuideMap: spinWrapper(asyncSaveGuideMap),
  asyncAddTag: spinWrapper(asyncAddTag),
  asyncRemoveTag: spinWrapper(asyncRemoveTag),
  asyncUpdateGuideMapName: spinWrapper(asyncUpdateGuideMapName),
};
