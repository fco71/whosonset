// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    hot: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              //modules: { //Lets remove that
              //  mode: "local",
              //  localIdentName: "[name]__[local]--[hash:base64:5]",
              //},
            },
          },
          "postcss-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              //sassOptions: { //LETS REMOVE THAT
              //  includePaths: [path.resolve(__dirname, "src/styles")],
              //},
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new Dotenv({
      path: './.env', // load this now instead of the ones in '.env'
      safe: false, // load '.env.example' to verify the '.env' entries.
      // the following is good for Github Actions
      allowEmptyValues: true, // allow empty variables in the '.env' file, handle them in you code
      systemvars: true, // load all the predefined 'process.env' variables
      silent: true, // hide any errors
      defaults: false // load '.env.defaults' as the default values
    })
  ],
};