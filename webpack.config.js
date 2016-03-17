var webpack = require('webpack');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        loader: 'babel?presets[]=react,presets[]=es2015'
      }
    ],
  },
  entry: './src/index.js',
  output: {
    filename: 'bundle.js'
  }
};