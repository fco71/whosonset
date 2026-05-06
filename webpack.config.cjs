const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isProduction ? '[name].[contenthash:8].js' : '[name].bundle.js',
    chunkFilename: isProduction ? '[id].[contenthash:8].chunk.js' : '[id].chunk.js',
    publicPath: '/',
    clean: true,
  },
  devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, 'public'),
      publicPath: '/',
    },
    client: {
      overlay: {
        errors: true,
        warnings: false,
        runtimeErrors: false,
      },
    },
    compress: true,
    port: 8000,
    open: false,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      minify: isProduction ? {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
      } : {},
    }),
    new Dotenv(),
    isProduction && new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: '../bundle-analysis.html',
      openAnalyzer: false,
    }),
  ].filter(Boolean),
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom|@firebase|firebase)[\\/]/,
          name(module) {
            // Get the package name from the module
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )?.[1];
            // Return a consistent name for the chunk
            return `vendor.${packageName.replace('@', '')}`;
          },
          chunks: 'all',
          enforce: true,
        },
      },
    },
    runtimeChunk: {
      name: 'runtime',
    },
    minimize: isProduction,
    moduleIds: 'deterministic',
    chunkIds: 'deterministic',
  },
  performance: {
    hints: isProduction ? 'warning' : false,
    maxEntrypointSize: 1024 * 1024, // 1MB
    maxAssetSize: 1024 * 1024, // 1MB
  },
};
