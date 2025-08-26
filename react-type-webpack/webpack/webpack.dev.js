const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { plugins } = require('./webpack.common');
module.exports = {
  mode: 'development',
  devServer: {
    hot: true,
    open:true 
  },
  devtool: 'cheap-module-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.name':JSON.stringify(`Rudr'a`)
    }),
    new ReactRefreshWebpackPlugin()
  ]
}