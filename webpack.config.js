const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
var nodeExternals = require('webpack-node-externals');

module.exports = {
    plugins: [
        new CopyPlugin([
            { from: 'src/examples/templates', to: 'examples/templates' }
        ]),
    ],
    mode: 'development',
    entry: './src/index.ts',
    module: {
        rules: [ { test: /\.tsx?$/, loader: 'ts-loader' } ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    target: 'node', // in order to ignore built-in modules like path, fs, etc.
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
    output: {
        path: path.resolve(__dirname, 'dist'),
    }
};