const AutoDllPlugin = require('autodll-webpack-plugin');

module.exports = () => {
  return new AutoDllPlugin({
    inject: false, // will inject the DLL bundles to index.html
    filename: '[name].js',
    entry: {
      vendor: [
        'react',
        'react-dom',
        'react-loadable',
        "redux",
        "react-redux",
        "react-router-dom",
        "react-router-redux",
        "redux-saga",
        "redux-thunk"
      ]
    }
  })
}
