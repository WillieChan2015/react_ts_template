"use strict";

const path = require('path');
const config = require('./config.js');

const commonConfig = {
    resolve: {                                    // 指定可以被 import 的文件后缀
        extensions: [".ts", ".tsx", '.js'],
        alias: {                                    // 配置常用路径
            src: path.resolve(__dirname, '../src'),
            views: 'src/views',
            js: 'src/js',
        }
    },

    module: {
        strictExportPresence: true,
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: require.resolve('source-map-loader'),
                enforce: 'pre',
                include: path.resolve(__dirname, '../src'),
            },
            { 
                test: /\.tsx?$/, 
                use: [ 
                    { 
                        loader: "babel-loader" 
                    }, 
                    { 
                        loader: "awesome-typescript-loader" 
                    } 
                ] 
            },
            {
                test: /\.(png|jpe?g|jpg|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: path.posix.join(config.prod.subDirectory, 'img/[name].[hash:7].[ext]'),
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: path.posix.join(config.prod.subDirectory, 'fonts/[name].[hash:7].[ext]')
                }
            },
        ],
    },

    optimization: {
        splitChunks: {
            chunks: 'all',
            name: 'common',
        },
    },
};

module.exports = commonConfig;