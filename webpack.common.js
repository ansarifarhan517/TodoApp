const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const webpack = require('webpack');

const isMock = process.env.NODE_ENV === 'mock';

module.exports = {
  entry: './index.tsx',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'assets/js/[name].[fullhash].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    alias: {
      '@utils': path.resolve(__dirname, 'src/utils'), // Adjust alias paths
      '@api': path.resolve(__dirname, 'src/api'),
      '@config': path.resolve(__dirname, 'src/config'),
      '@base': path.resolve(__dirname, 'src/base'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@redux': path.resolve(__dirname, 'src/redux'),
    },
  },
  optimization: {
    usedExports: true,
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new StylelintPlugin({
      syntax: 'scss',
      emitError: true,
      lintDirtyModulesOnly: true,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        IS_MOCK: isMock,
      },
    }),
    new ESLintPlugin({
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    }),
    new HtmlWebPackPlugin({
      template: './index.html',
      filename: './index.html',
    }),
  ],
};
