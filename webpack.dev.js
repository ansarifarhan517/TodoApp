const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common')
const ESLintPlugin = require('eslint-webpack-plugin');

const devConfig = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    port: process.env.PORT || 8080,
    host: '0.0.0.0',
    historyApiFallback: true,
    compress: true,
    hot: true,
    proxy: {
      path: '/api/*',
      target: 'http://localhost:9090'
    }
  },
  module: {

    rules: [
      {

        test: /\.s?css$/,
        use: [
          {
            loader: 'style-loader',
          }, {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      }],
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
      fix: true,
      emitError: true,
      failOnError: true,
    }),
  ]
}

module.exports = merge(commonConfig, devConfig)
