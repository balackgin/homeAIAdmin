import {get, post} from '../../common/core/request';
import { host } from '../common/utils/';

/**
 * 获取项目列表
 * @param {Number} params 内包含可选参数 page:页数，size:条数，status：分类，keywords: 关键词
 */
export async function fetchContributions(params) {
  return get(`${host}/api/designer/samples`, { type: 'ONLINE', ...params});
}

export async function recallContribution(sampleId) {
  return post(`${host}/api/designer/samples/${sampleId}/recall`,);
}

export async function getCounts(keyword) {
  // TODO: 参数传递方式要改
  return get(`${host}/api/designer/samples/statusCount?type=ONLINE${keyword ? `&keyword=${keyword}` : ''}`);
}