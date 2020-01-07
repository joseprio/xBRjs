const EsmWebpackPlugin = require('@purtuga/esm-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    library: 'xBRjs',
    libraryTarget: 'var',
    filename: 'xBRjs.min.esm.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new EsmWebpackPlugin()
  ]
};
