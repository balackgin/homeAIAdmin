import axios from 'axios';
import { host } from '../common/utils/';
import {get} from '../../common/core/request';

export async function getCityCodes() {
  const cityCodes = await axios.get(
    'https://g.alicdn.com/homeai-fe/staticAssets/0.1.0/provinceCity.json',
    {},
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' }
    }
  ).then(res => res.data);
  return cityCodes;
}

export async function getUserInfo() {
  return get(`${host}/api/user`);
}

export async function Loginout() {
  const loginStatus = await axios.get(`${host}/api/logout`);
  return loginStatus;
}