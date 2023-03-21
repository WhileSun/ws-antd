const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = merge(commonConfig,{
  mode:"production",
  entry: './src/components/index.ts',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'index.js',
    chunkFilename: '[name].chunk.js',
    libraryTarget: 'umd',  
    library: 'WsAntd'
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ]
  },
  // 打包时哪些模块是外部依赖，不需要打包进输出的文件中
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'React',
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
      root: 'ReactDOM',
    },
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  optimization: {
    usedExports: true,
  },
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all',
  //     name: '[name].[contenthash].js'
  //   }
  // }
});