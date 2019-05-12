export const MENU_CONFIG_DESIGNER = [
  {
    key: 'messages',
    icon: 'notification',
    title: '消息管理',
    path: '',
    // optional subMenus
    subMenus: [{
      title: '项目消息',
      disabled: true,
      path: ''
    }, {
      title: '投稿消息',
      disabled: false,
      path: '/messages/contribution-msg',
    }]
  }, {
    key: 'project',
    icon: 'schedule',
    title: '项目管理',
    disabled: true,
    path: '',
  }, {
    key: 'contribution',
    icon: 'inbox',
    title: '投稿管理',
    path: '',
    // optional subMenus
    subMenus: [{
      title: '投稿记录',
      disable: false,
      path: '/contribution/records'
    }, {
      title: '案例库',
      disable: false,
      path: '/samples/list'
    }]
  }, {
    key: 'cases',
    icon: 'book',
    title: '设计方案管理',
    path: '/cases/library',
  }
];
