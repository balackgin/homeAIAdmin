// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html

import {
  Library,
  Quotation,
  Edit,
} from './';

export default {
  path: 'cases',
  name: 'Cases',
  childRoutes: [
    { path: 'library', name: 'Library', component: Library, isIndex: true },
    { path: 'quotation/:id', name: 'Quotation', component: Quotation },
    { path: 'edit/:id/:token', name: 'Edit', component: Edit },
  ],
};
