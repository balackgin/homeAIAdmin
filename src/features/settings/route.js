// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html

import {
  UserInfo,
} from './';

export default {
  path: 'settings',
  name: 'Settings',
  childRoutes: [
    { path: 'userInfo', name: 'UserInfo', component: UserInfo, isIndex: true },
  ],
};
