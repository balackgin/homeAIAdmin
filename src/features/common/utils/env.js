const ENV = (() => {
  const host = window.location.host;

  if (host.indexOf('g-assets.daily.taobao.net') > -1 || host.indexOf('g.alicdn') > -1) {
    // cdn index.html
    return 'cdn';
  }

  if (host.indexOf('localhost') > -1 || host.indexOf('127.0.0.1') > -1) {
    // local dev env
    return 'local';
  } else {
    const env = window.g_config && window.g_config.env;
    if (['daily', 'pre', 'production'].indexOf(env) < 0) {
      console.error('invalid g_config.env:', env);
      return 'daily';
    }

    return env;
  }
})();

export default ENV;

console.log('ENV:', ENV);