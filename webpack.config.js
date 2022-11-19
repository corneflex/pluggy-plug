const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const deps = require('./package.json').dependencies;
const ModuleFederationPlugin =
    require('webpack').container.ModuleFederationPlugin;

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, 'src', 'index.tsx'),
    output: {
        publicPath: '/',
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'pluggy-host',
            shared: {
                react: {
                    requiredVersion: deps.react,
                    import: 'react', // the "react" package will be used a provided and fallback module
                    shareKey: 'react', // under this name the shared module will be placed in the share scope
                    shareScope: 'default', // share scope with this name will be used
                    singleton: true, // only a single version of the shared module is allowed
                },
                'react-dom': {
                    requiredVersion: deps['react-dom'],
                    singleton: true, // only a single version of the shared module is allowed
                },
            },
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'public', 'index.html'),
        }),
    ],
};
