var file, scripts = document.getElementsByTagName("script");
file = scripts[scripts.length - 1].getAttribute("src");
var isRelative = file[0] !== '/';
if (isRelative) {
  // relative path => absolute path
  file = window.location.host + window.location.pathname +'/' +file;
}
if (file.indexOf('g-assets.daily.taobao.net') >= 0
  || file.indexOf('g.alicdn.com') >= 0) {
  var arr = file
	  .split('/')
		.filter(function (s) {
			return s.length > 0;
		});

  // keep host/group/project/version
  arr.splice(4);
  // var prefix = arr.join('/');
  __webpack_public_path__ = '//' + arr.join('/') + '/';

  if (isRelative) {
    // 在使用browserHistory的时候使用
    // 这种场景是直接访问CDN上的index.html页面, 为了使路由生效，需要设置CDN_BASENAME
    // remove host, keep group/project/version
    arr.splice(0, 1);
    // used by browserHistory base name
    window.CDN_BASENAME = '/'+ arr.join('/');
  }
  
} else {
  __webpack_public_path__ = "./";   
}

console.log('__webpack_public_path__ is:', __webpack_public_path__, window.CDN_BASENAME)