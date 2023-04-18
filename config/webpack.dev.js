const path = require('path');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(commonConfig,{
  mode: 'development',
  entry: './src/index.js',
  devServer: {
    static: path.join(__dirname, 'public'),
    compress: true,
    port: 3100,
    hot:true,
    open:true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
});