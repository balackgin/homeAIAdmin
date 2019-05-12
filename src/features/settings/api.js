import {get, post} from '../../common/core/request';
import { host } from '../common/utils/';

/**
 * 获取项目列表
 * @param {Number} minPrice - 最低价格
 * @param {Number} maxPrice - 最高价格
 * @param {Number} styleList - 设计风格列表
 * @param {Number} areaList - 常驻地区列表
 */
export async function getUserInfo() {
  return get(`${host}/api/user`);
}
export async function updateUserinfo({role, ...extras}) {
  return post(`${host}/api/common/update`, extras);
}