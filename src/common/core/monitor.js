/**
 * 封装黄金令箭功能，http://log.alibaba-inc.com/track/info.htm?spm=a1z3g.10667093/2395.0.0.7c8a2f07gbF2iO&type=2504
 * @param {string} logkey 
 * @param {string} type EXP/CLK/SLD/OTHER
 * @param {object} gokey 
 */

const record = function (logkey, type, gokey) {
  const gokeyStr = Object.keys(gokey).map(key => `${key}=${gokey[key]}`).join('&');
  window.goldlog && window.goldlog.record(logkey, type, gokeyStr, 'GET');
};

export const click = (logkey, gokey) => {
  record(logkey, 'CLK', gokey);
};

export const exposure = (logkey, gokey) => {
  record(logkey, 'EXP', gokey);
};
