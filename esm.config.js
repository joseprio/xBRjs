const EsmWebpackPlugin = require('@purtuga/esm-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    library: 'xBRjs',
    libraryTarget: 'var',
    filename: 'xBRjs.esm.js'
  },
  optimization: {
	  minimize: false,
  },
  plugins: [
    new EsmWebpackPlugin()
  ]
};
