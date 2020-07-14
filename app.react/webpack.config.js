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