const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Options for PostCSS as we reference these options twice
// Adds vendor prefixing based on your specified browser support in
// package.json
const postCSSLoaderOptions = {
  // Necessary for external CSS imports to work
  ident: 'postcss',
  plugins: () => [
    require('postcss-flexbugs-fixes'),
    autoprefixer({
      browsers: [
        '>1%',
        'last 4 versions',
        'Firefox ESR',
        'not ie < 9', // React doesn't support IE8 anyway
      ],
      flexbox: 'no-2009',
    }),
  ],
};

module.exports = (cssType, env) => {
  // "postcss" loader applies autoprefixer to our CSS.
  // "css" loader resolves paths in CSS and adds assets as dependencies.
  // "style" loader turns CSS into JS modules that inject <style> tags.
  // In production, we use a plugin to extract that CSS to a file, but
  // in development "style" loader enables hot editing of CSS.
  // By default we support CSS Modules with the extension .module.css
  if (cssType === 'css-loader') {
    return [
      env === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
      'css-loader', {
        loader: 'postcss-loader',
        options: postCSSLoaderOptions,
      },
    ];
  }
  return [
    env === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
    'css-loader', {
      loader: 'postcss-loader',
      options: postCSSLoaderOptions,
    }, {
      loader: cssType,
      // when import antd,
      // it will show error "Inline JavaScript is not enabled. Is it set in your options?"
      // so add this options
      // https://stackoverflow.com/questions/46729091/enable-inline-javascript-in-less
      options: {
        javascriptEnabled: true,
      },
    },
  ];
};
