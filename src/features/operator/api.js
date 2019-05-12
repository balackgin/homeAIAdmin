import {get, post} from '../../common/core/request';
import { host } from '../common/utils/';

/**
 * 获取项目列表
 * @param {Number} params 内包含可选参数 page:页数，size:条数，status：分类，keywords: 关键词
 */
export async function fetchOperations(params) {
  return get(`${host}/api/samples`, { ...params});
}

export async function operateCases(params) {
  const { action, sampleId } = params;

  return post(`${host}/api/samples/${sampleId}/${action}`);
}