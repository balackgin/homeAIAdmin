// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html

import {
  List,
  Detail,
} from './';

export default {
  path: 'project',
  name: 'Project',
  childRoutes: [
    { path: 'list', name: 'List', component: List, isIndex: true },
    { path: 'detail/:id', name: 'Detail', component: Detail },
  ],
};
