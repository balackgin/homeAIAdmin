import * as api from './api';
import { spinWrapper } from '../../common/core/wrapper';

/**
 * 获取项目列表
 * @param {Number} page - 页数 必传
 * @param {Number} size - 条数 必传
 * @param {String} keyword - 搜索内容 必传
 * @param {Array} status - 搜索状态 必传
 * @param {String} aspect - 数据方向
 */
export async function getContributions(params) {
  const { sampleList, totalCount, statusTotalCount } = await api.fetchContributions(params);
  return { sampleList, totalCount, statusTotalCount };
}

export async function recallConStatus(sampleId) {
  const { status } = await api.recallContribution(sampleId);
  return { status };
}

export async function getCounts(keyword) {
  const data = await api.getCounts(keyword);
  return { data };
}

export const servicesWithSpin = {
  getRecords: spinWrapper(getContributions),
};
