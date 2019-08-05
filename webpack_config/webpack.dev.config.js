'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const autoprefixer = require('autoprefixer');
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const config = require('./config.js');
const commonConfig = require("./webpack.common.config.js");

const hostPort = 8052;

const devConfig = {
    mode: 'development',
    // 增强调试
    devtool: 'inline-source-map',

    entry: [
        "babel-polyfill",
        // 开启 React 代码的模块热替换(HMR)
        // 'react-hot-loader/patch',
        // 貌似有这句就不用上面那句了
        require.resolve('react-dev-utils/webpackHotDevClient'),
        path.join(__dirname, '../src/main.tsx'),
    ],

    output: {
        publicPath: config.prod.publicPath,
        path: config.prod.root,
        filename: path.posix.join(config.prod.subDirectory, 'js/[name].js'),
        chunkFilename: path.posix.join(config.prod.subDirectory, 'js/[name].chunk.js'), //注意这里，用[name]可以自动生成路由名称对应的js文件
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(), //热更新插件
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/index.html'), //依据的模板
            filename: 'index.html', //生成的html的文件名
            inject: true, //注入的js文件将会被放在body标签中,当值为'head'时，将被放在head标签中
        }),
    ],

    module: {
        rules: [
            {
                test: /\.(css|scss)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                              plugins: function () {
                                return [autoprefixer({ browsers: ["> 1%","last 2 versions","not ie <= 8"] })];
                              }
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            // includePaths: [path.resolve(__dirname, "../node_modules/compass-mixins/lib")]
                        }
                    }
                ]
            },
        ]
    },

    devServer: {
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, '../src'),	// 提供静态文件路径
        publicPath: '/',
        host: '0.0.0.0',
        port: hostPort,
        compress: true, // gzip压缩
        // 热替换配置
        hot: true,
        inline: true,
        // 后台日志文字颜色开关
        stats: { 
            colors: true
        },
        // 反向代理api设置
        // proxy: [
        //     {
        //         context: ["/api", "/graphql"],
        //         target: "http://127.0.0.1:3031", // 测试服务器
        //         // target: "http://192.168.4.215:9000", // 伟聪服务器
        //         changeOrigin: true // 必须配置为true，才能正确代理
        //     }
        // ],
        before(app) {
            app.use(errorOverlayMiddleware());
            
            app.use(noopServiceWorkerMiddleware());
        },
        after(app) {
            console.log('Listening at 0.0.0.0:' + hostPort + '...');
        }
    }
};

module.exports = merge(commonConfig, devConfig);