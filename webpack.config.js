const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

let optimization = {
  minimizer: [],
};

let outputFileName = 'main.js';
let mode = 'development';

if (process.env.NODE_ENV === 'production') {
  optimization.minimizer.push(new UglifyJsPlugin());
  outputFileName = 'main.min.js';
  mode = 'production';
}

const config = {
  entry: path.resolve(__dirname, 'src', 'app', 'js', 'main.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: outputFileName,
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        enforce: 'pre',
        use: [
          {
            loader: 'tslint-loader',
            options: {
              "configFile": "tslint.json",
              "tsConfigFile": "tsconfig.json",
              "typeCheck": true
            }
          }
        ],
        exclude: /(node_modules|bower_components)/,
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]?[hash]'
            }
          }
        ]
      }
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  optimization,
  mode,
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    compress: true,
    port: 8100,
    watchContentBase: true,
    hot: true,
    inline: true,
    noInfo: true,
    open: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
      hash: true,
      inject: true,
    }),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, 'src', 'app', 'static'),
        to: 'assets/',
      },
    ]),
  ],
};

module.exports = config;
