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
      // CSS Modules (for component-specific styles)
      {
        test: /\.module\.s[ac]ss$/i,  // Matches .module.scss or .module.sass
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]', // Customize class names
              },
              importLoaders: 2,
            },
          },
          "postcss-loader",
          "sass-loader",
        ],
        include: path.resolve(__dirname, 'src'),
      },
      // Global styles (for index.scss and other global stylesheets)
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
        include: path.resolve(__dirname, 'src'),
        exclude: /\.module\.s[ac]ss$/i,  // Exclude CSS Modules
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
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