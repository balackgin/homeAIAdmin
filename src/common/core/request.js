import axios from 'axios';
import store from '../store';
import { showErrorMsg} from '../../features/common/redux/actions';
import BizError from '../../features/common/utils/BizError';
import ENV from '../../features/common/utils/env';

// Error code from server: need to negoiate with server
const ERRORS = {
  BIZ_VERIFY_ERROR: "验证码错误",
  BIZ_TEXTSEND_ERROR: "BIZ_TEXTSEND_ERROR",
  TOO_FREQUENT: "请求太频繁",
  NONT_LOGIN: "会话失效,请重新登录!",
  INVALID_USER: "您尚未被邀请",
  BIZ_PASS_SAMPLE_FAIL: "案例审核失败",
  BIZ_ONLINE_SAMPLE_FAIL: "案例审核失败",
  BIZ_REFUSE_SAMPLE_FAIL: "案例审核失败",
}

async function buildRequest(method, url, params) {
  const headers = { 'content-type': 'application/json;charset=utf-8' };
  if (url.indexOf('//mocks.alibaba-inc.com/') < 0) {
    headers['withCredentials'] = true;
    headers['X-XSRF-TOKEN'] = window.g_config.csrf;
  }

  const param =  (method === 'post') ?  JSON.stringify(params): { params };
  const config = {
    headers,
    dataType: 'json'
  };

  const st = new Date().getTime();
  return axios[method](url, param, config)
    .then((response) => {
      const {data, success, msg, code} = response.data;
      if (success === false && 'DUPLICATED_PHONE' === code) {
        // special handling! Users are required to bind their phone
        store.dispatch({ type: "BIND_PHONE", payload: msg});
        return;
      } 

      // 此处需要跟服务端同学沟通协商数据结构
      if (success === false) {
        const defaultMsg = (ENV === 'production' || ENV === 'pre') ? '未知服务端错误': `未知服务端错误, 错误码[${code}]`;
        console.warn('error code:', code);
        const errMsg = ERRORS[code] ? ERRORS[code] : defaultMsg;
        store.dispatch(showErrorMsg(errMsg));
        throw new BizError(code);
      }

      const et = new Date().getTime();
      window.__bl && window.__bl.api && window.__bl.api(url, true, et - st, code, msg || 'success');
      return data;
    }).catch((error) => {
      if (!(error instanceof BizError)) {
        store.dispatch({
          type: 'REQUEST_ERROR',
          payload: {
            error: error.msg,
          },
        });
        console.log(error)
        console.warn('BizError:', error.code)
      } else {
        console.error('unknow request error:', error)
      }

      const et = new Date().getTime();
      window.__bl && window.__bl.api && window.__bl.api(url, false, et - st, error.code, error.msg);

      throw error;
    });
}

export const get = (url, params = {}) => buildRequest('get', url, params);

export const post = (url, params = {}) => buildRequest('post', url, params);

export const put = (url, params = {}) => buildRequest('put', url, params);

export const del = (url, params = {}) => buildRequest('delete', url, params);