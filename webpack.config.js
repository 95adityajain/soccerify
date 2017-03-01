var webpack = require("webpack");
var path = require("path");

const host = 'localhost';
const port = 3000;
const clientWebpack = `webpack-dev-server/client?http://${host}:${port}/`;
const hotWebpack = "webpack/hot/only-dev-server";

var config = {
  entry: {
    background: [path.join(__dirname + "/background/index.js")],
    app: [path.join(__dirname + "/app/index.js")]
  },
  devServer: {
    stats: {
      colors: true
    },
    noInfo: true
  },
  output: {
    path: path.join(__dirname, '/build/js'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({minimize: true})
  ]
};

module.exports = config;
