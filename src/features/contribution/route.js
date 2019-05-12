// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html

import {
  Records
} from './';

export default {
  path: 'contribution',
  name: 'Contribution',
  childRoutes: [
    { path: 'records', name: 'Records', component: Records, isIndex: true }
  ],
};
