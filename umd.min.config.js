const EsmWebpackPlugin = require('@purtuga/esm-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    library: 'xBRjs',
    libraryTarget: 'umd',
    filename: 'xBRjs.min.umd.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
};
