const  webpack  = require("webpack");
const { plugins } = require('./webpack.common');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.name': JSON.stringify('rudresh')
    })
  ]
}