import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import(/* webpackChunkName: "RoomEditor" */'./RoomEditor'),
  loading: () => null,
});
