const path = require('path');

module.exports = {
  entry: './src/index.tsx',  // Point to your .tsx entry file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,  // Handle .tsx and .ts files
        use: 'ts-loader',  // Use ts-loader to compile TypeScript
        exclude: /node_modules/,
      },
      {
        test: /\.module\.css$/,  // Match only .module.css files
        use: ['style-loader', {
          loader: 'css-loader',
          options: {
            modules: {
              localIdentName: '[name]__[local]___[hash:base64:5]',  // Customize class name format
            },
          },
        }],
      },
      {
        test: /\.css$/,  // Handle non-module .css files
        exclude: /\.module\.css$/,  // Exclude module CSS files
        use: ['style-loader', 'css-loader'],  // Regular CSS files without modules
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],  // Resolve these extensions
  },
};
