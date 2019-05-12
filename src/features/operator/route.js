// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html

// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html
import {
  OperatCases,
  Preview,
} from './';

export default {
  path: 'operator',
  name: 'Operator',
  childRoutes: [
    { path: 'operat-cases', name: 'Operat cases', component: OperatCases, isIndex: true },
    { path: 'preview/:id', name: 'Preview', component: Preview },
  ],
};
