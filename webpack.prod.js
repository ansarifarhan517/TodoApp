const { merge } = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const commonConfig = require('./webpack.common')

const prodConfig = {
  mode: 'production',
  module: {
    rules: [{
      test: /\.s?css$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
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
    new MiniCssExtractPlugin({
      filename: 'assets/css/styles.[name].[fullhash].css',
    }),
  ],
}

module.exports = merge(commonConfig, prodConfig)
