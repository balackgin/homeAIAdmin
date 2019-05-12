import { get, post } from '../../common/core/request';
import { host } from '../common/utils/';

export async function getSampleList(page, size, keyword) {
  return get(`${host}/api/designer/samples?`, { type: 'DESIGNER', status: 'EXIST', page, size, keyword });
}

export async function getSampleDetail(id) {
  return get(`${host}/api/designer/samples/${id}?`);
}

export async function postSample(id) {
  return post(`${host}/api/designer/samples/${id}/post`);
}

export async function saveSample(payload) {
  return post(`${host}/api/designer/samples`, payload);
}

export async function getCaseList(page, size) {
  return get(`${host}/api/case/queryCases?`, { page: page, size: size });
}

export async function deleteSample(id) {
  return post(`${host}/api/designer/samples/${id}/delete`);
}

export async function getUserInfo() {
  return get(`${host}/api/user`);
}
