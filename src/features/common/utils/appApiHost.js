import ENV from './env';

// 如果是local, cdn则请求mockjs数据, 否则访问当前域的数据
const appApiHost = (() => {
  if (['local', 'cdn'].indexOf(ENV) >= 0 ) {
    if (window.g_config.role === 'operator') {
      return 'https://mocks.alibaba-inc.com/mock/SJeCjhUDGQ';
    } else {
      return 'https://mocks.alibaba-inc.com/mock/SJydhKDbX';
    }
  } 

  return '';
})();

export default appApiHost;