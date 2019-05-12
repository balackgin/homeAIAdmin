import ENV from './env';

const oss = {
  bucketName: `homeai_fe_${ENV}`
};

if ((['pre', 'production'].indexOf(ENV) >= 0)) {
  oss.cdn = '//ossgw.alicdn.com/homeai-inner/';
  oss.endpoint = '//homeai-inner.cn-hangzhou.oss.aliyun-inc.com';
} else {
  oss.cdn = '//ossgw.alicdn.com/homeai/';
  oss.endpoint = '//homeai.oss-cn-beijing.aliyuncs.com';
}

export default oss;