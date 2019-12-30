const path = require('path');

module.exports = {
  entry: './src/demo.js',
  output: {
    filename: 'demo.js',
    path: path.resolve(__dirname, 'demo'),
  },
  optimization: {
	  minimize: false,
  }
};
