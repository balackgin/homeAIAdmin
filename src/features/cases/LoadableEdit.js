import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import(/* webpackChunkName: "Edit" */'./Edit'),
  loading: () => null,
});
