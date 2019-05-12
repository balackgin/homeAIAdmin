
export const MENU_CONFIG_OPERATOR = [
  {
    key: 'contribution',
    icon: 'inbox',
    title: '投稿案例审核',
    path: '/sample-check/check-list',
  }, {
    key: 'operation',
    icon: 'solution',
    title: '运营管理',
    path: '',
    // optional subMenus
    subMenus: [{
      title: '运营文章',
      disabled: true,
      path: ''
    }, {
      title: '投稿案例',
      disabled: false,
      path: '/operator/operat-cases'
    }, {
      title: '首页文章位置',
      disabled: true,
      path: '/'
    }],
  }
];
