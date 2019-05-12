// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html

import {
  SignupPage,
} from './';

export default {
  path: 'signup',
  name: 'Signup',
  childRoutes: [
    { path: '*', name: 'index', component: SignupPage, isIndex: true },
  ],
};
