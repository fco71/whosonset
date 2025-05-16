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
        publicPath: '/', //  Needed for correct routing.
    },
    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
        hot: true,
        historyApiFallback: true, //  Enable SPA routing
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
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                        },
                    },
                    'postcss-loader',
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