import { post } from '../../common/core/request';
import { host } from '../common/utils/';

export async function asyncVerify(payload) {
  return post(`${host}/api/genPhone`, payload);
}

export async function asyncRegister({role, ...extras}) {
  return post(`${host}/api/common/update`, extras);
}

export async function checkVerify(code) {
  return post(`${host}/api/checkverify`, {verify: code});
}
