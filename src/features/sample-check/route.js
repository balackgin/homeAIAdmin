// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html

// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html
import {
  CheckList,
  Check,
} from './';

export default {
  path: 'sample-check',
  name: 'Sample check',
  childRoutes: [
    { path: 'check-list', name: 'Check list', component: CheckList, isIndex: true },
    { path: 'check/:id', name: 'Check', component: Check },
  ],
};
