const webpack = require('webpack');
const { plugins } = require('./webpack.common');
module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.name':JSON.stringify(`Rudr'a`)
    })
  ]
}