const htmlWebpackPlugin = require('html-webpack-plugin'); //生成html
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin"); //分离css
const UglifyJSPlugin = require('uglifyjs-webpack-plugin'); //压缩js
module.exports = {
    //入口
    entry: {
        main: './src/app.js',
        //单独再指定一个入口，将这个入口内人所有第三方包，作为公共资源抽取出来
        vendor: ['vue', 'vue-router', 'vue-resource', 'vue-preview'],
    },
    //出口
    output: {
        path: __dirname + '/GdkykefuApp'
    },
    //不编译文件引入库
    externals: {
        'BMap': 'BMap',
        'AMap': 'AMap',
    },
    //模块
    module: {
        loaders: [{
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader", //最终回路
                use: ['css-loader', 'autoprefixer-loader']
            })
        }, {
            test: /\.less$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader", //最终回路
                use: ['css-loader', 'autoprefixer-loader', 'less-loader']
            })
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            query:
            {
                presets: ['es2015'],
                plugins: ['transform-runtime']
            }
        },{
            test: /\.vue$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            query:
            {
                presets: ['es2015'],
                plugins: ['transform-runtime']
            }
        }, {
            test: /vue-preview.src.*?js$/,
            loader: 'babel-loader'
        },{
            test: /\.vue$/,
            loader: 'vue-loader'
        }, {
            test: /\.(png|jpg|svg|ttf|gif|jpeg)$/,
            loader: 'url-loader?limit=4096'
        }]
    },
    plugins: [ //插件
        new htmlWebpackPlugin({
            template: './src/app.html',
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new ExtractTextPlugin("styles.css"),
        //loader部分的操作配合该插件的使用

        //声明公共插件
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'init'], //init也会生成一个文件，就是一个虚拟文件，记录着相关vendor与main之间的关系，如果main发生改变，只更新init.js文件，而第三方的可以不动
        }),
        //压缩
        new UglifyJSPlugin(),

        //引入jquery
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "windows.jQuery": "jquery"
        })
    ],
}

//初始的时候module.exports = exports
//当module.exports = {};    exports 还是原来的对象

//做判断
if (process.argv.length === 5) {
    //webpack-dev-server启动的
    module.exports.output.filename = '[name].js';
} else {
    module.exports.output.filename = '[name].[chunkhash].js';
}
// console.log(process.argv); //命令行参数

//判断如果是通过webpack  需要hash
//如果是通过webpack-dev-.... 就不需要加上hash
