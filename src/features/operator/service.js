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
export async function getOperationsResult(params) {
  const { dataArr: operations, totalCount, statusTotalCount } = await api.fetchOperations({...params});
  return { operations, totalCount, statusTotalCount };
}

export async function deleteCase(sampleId) {
  const { status } = await api.operateCases(sampleId);
  return { status };
}

export const servicesWithSpin = {
  getRecords: spinWrapper(getOperationsResult),
  deleteCase: spinWrapper(deleteCase)
};
