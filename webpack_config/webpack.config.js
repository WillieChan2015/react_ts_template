"use strict";

const webpack = require("webpack");
const path = require("path");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const autoprefixer = require("autoprefixer");
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const config = require("./config.js");
const commonConfig = require("./webpack.common.config.js");

const prodConfig = {
    entry: {
        app: ["babel-polyfill", path.join(__dirname, "../src/main.tsx")],
        vendor: [
            "react",
            // "react-router-dom",
            // "redux",
            "react-dom",
            // "react-redux"
        ]
    },
    output: {
        // 定义出口
        publicPath: config.prod.publicPath,
        path: config.prod.root,
        filename: path.posix.join(
            config.prod.subDirectory,
            "js/[name].[contenthash:5].js"
        ),
        chunkFilename: path.posix.join(
            config.prod.subDirectory,
            "js/[name].[chunkhash:5].chunk.js"
        ) //注意这里，用[name]可以自动生成路由名称对应的js文件
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.(css|scss)$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        "css-loader",
                        {
                            loader: "postcss-loader",
                            options: {
                                plugins: function() {
                                    return [
                                        autoprefixer({
                                            browsers: [
                                                "> 1%",
                                                "last 2 versions",
                                                "not ie <= 8"
                                            ]
                                        })
                                    ];
                                }
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                includePaths: [
                                    path.resolve(
                                        __dirname,
                                        "../node_modules/compass-mixins/lib"
                                    )
                                ]
                            }
                        }
                    ],
                    fallback: "style-loader"
                })
            }
        ]
    },
    plugins: [
        // 用于打包前清理 dist 下的文件
        new CleanWebpackPlugin(['dist/']),

        //将js中引入的css分离的插件
        new ExtractTextPlugin({
            filename: path.posix.join(config.prod.subDirectory, 'css/[name].[chunkhash:5].css'),
            allChunks: false // 指明为false，否则会包括异步加载的 CSS
        }),

        //压缩提取出的css，并解决ExtractTextPlugin分离出的js重复问题(多个文件引入同一css文件)
        new OptimizeCSSPlugin(),

        //html模板配置
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/index.html'),
            filename: 'index.html', //生成的html的文件名
            inject: true, //注入的js文件将会被放在body标签中,当值为'head'时，将被放在head标签中
            // hash: true, //为静态资源生成hash值
            // minify: {  //压缩配置
            //   removeComments: true, //删除html中的注释代码
            //   collapseWhitespace: false,  //删除html中的空白符
            //   removeAttributeQuotes: false  //删除html元素中属性的引号
            // },
            // chunksSortMode: 'dependency' //按dependency的顺序引入
        }),

        // 指定环境
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            },
        }),

        // 压缩代码
        new UglifyJSPlugin(),
    ]
};

module.exports = merge(commonConfig, prodConfig);