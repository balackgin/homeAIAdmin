// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html

// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html
import {
  List,
  SampleForm,
  Preview,
} from './';

export default {
  path: 'samples',
  name: 'Samples',
  childRoutes: [
    { path: 'list', name: 'List', component: List, isIndex: true },
    { path: 'sample-form/:id', name: 'Sample form', component: SampleForm },
    { path: 'preview/:id', name: 'Preview', component: Preview },
  ],
};
