const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const deps = require('./package.json').dependencies;
const ModuleFederationPlugin =
    require('webpack').container.ModuleFederationPlugin;

module.exports = {
    entry: './src/index.tsx',
    mode: 'development',
    target: 'web',
    devServer: {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods':
                'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers':
                'X-Requested-With, content-type, Authorization',
        },
        static: {
            directory: path.join(__dirname, 'public'),
        },
        port: 9000,
    },
    output: {
        publicPath: 'http://localhost:9000/',
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|tsx|ts)$/,
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
            name: 'pluggy',
            filename: 'remoteEntry.js',
            library: {
                type: 'module',
            },
            exposes: {
                './Widget': './src/components/Widget.tsx',
            },
            shared: {
                react: {
                    requiredVersion: deps.react,
                    eager: true,
                    import: 'react', // the "react" package will be used a provided and fallback module
                    shareKey: 'react', // under this name the shared module will be placed in the share scope
                    shareScope: 'default', // share scope with this name will be used
                    singleton: true, // only a single version of the shared module is allowed
                },
                'react-dom': {
                    requiredVersion: deps['react-dom'],
                    eager: true,
                    singleton: true, // only a single version of the shared module is allowed
                },
            },
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            inject: false,
        }),
    ],
    experiments: {
        outputModule: true,
    },
};
