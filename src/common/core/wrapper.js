import store from '../store';

export function spinWrapper(fun) {
  return async function spinWrapFun(...args) {
    store.dispatch({ type: 'PREPARE_REQUEST' });
    let data;
    try {
      data = await fun(...args);
    } catch (error) {
      throw error;
    } finally {
      store.dispatch({ type: 'REQUEST_FINISH' });
    }
    return data;
  };
}

export default {
  spinWrapper,
};
