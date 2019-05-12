import { get, post } from '../../common/core/request';
import { host } from '../common/utils/';

export async function getSampleCheckList(params) {
  const data = await get(`${host}/api/samples/count`);
  const { dataArr, totalCount } = await get(`${host}/api/samples`, { ...params });
  return { dataArr, statusCount: data, totalCount };
}

export async function doSampleCheck(id, action, reason) {
  if (action === 'refuse') {
    return post(`${host}/api/samples/${id}/${action}`, {reason});
  }
  return post(`${host}/api/samples/${id}/${action}`);
}

export async function getSampleStatusCount(status) {
  return get(`${host}/api/samples/count?`, { status })
}