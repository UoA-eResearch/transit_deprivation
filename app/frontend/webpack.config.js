const path = require("path");
const webpack = require('webpack');

module.exports = {
    entry: "./src/index.js",
    mode: "development",
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.geojson$/,
                loader: 'json-loader'
            }
        ]
    },
    resolve: { extensions: ["*", ".js"] },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    devServer: {
        contentBase: "./dist"
    },
    plugins: [new webpack.EnvironmentPlugin(['MapboxAccessToken'])]
};