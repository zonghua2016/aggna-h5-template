/*
 * @Author       : tongzonghua
 * @Date         : 2020-11-12 10:23:37
 * @LastEditors  : tongzonghua
 * @LastEditTime : 2021-03-24 10:17:08
 * @Email        : tongzonghua@360.cn
 * @Description  : vue config file
 * @FilePath     : /tank_box_h5/vue.config.js
 */
const path = require("path"),
    CompressionPlugin = require("compression-webpack-plugin"),
    vConsolePlugin = require("vconsole-webpack-plugin"),
    BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin,
    // PrerenderSPAPlugin = require('prerender-spa-plugin'),
    // Renderer = PrerenderSPAPlugin.PuppeteerRenderer
    // UglifyJsPlugin = require('uglifyjs-webpack-plugin'),
    // SentryWebpackPlugin = require('@sentry/webpack-plugin'),
    resolve = dir => path.join(__dirname, dir),
    env = process.env.NODE_ENV,
    IS_PROD = ["production", "prod", "test", "gray"].includes(env),
    { version } = require('./package.json');

module.exports = {
    // 设置根目录
    publicPath: process.env.NODE_ENV === 'production'
        ? process.env.VUE_APP_PUBLIC_PATH
        : '/',
    // 设置输出目录
    outputDir: 'dist',
    /* 静态资源导出路径 */
    assetsDir: 'static',
    lintOnSave: false,
    parallel: require('os').cpus().length > 1,
    productionSourceMap: false,
    // 向预处理器 Loader 传递选项
    css: {
        loaderOptions: {
            sass: {
                //   additionalData: `@import "~@/variables.sass"`
            },
            scss: {
                // prependData: `@import "@/assets/styles/variables.scss";`
            },
            less: {
                //   globalVars: {
                //     primary: '#fff'
                //   }
            }
        }
    },
    // webpack配置
    configureWebpack: config => {
        // process.env.VUE_APP_MODE === 'production' && config.plugins.push(
        //     new UglifyJsPlugin({
        //         uglifyOptions: {
        //             compress: {
        //                 drop_debugger: true, // 注释debugger
        //                 drop_console: true, // 注释console
        //                 pure_funcs: ['console.log'] // 移除console
        //             },
        //         },
        //         sourceMap: false,   // 去除打包后生成的.map文件
        //         parallel: true,
        //     }),
        // );
        // 开启图片压缩
        config.module.rules.push({
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            use: [
                {
                    loader: "image-webpack-loader",
                    options: { bypassOnDebug: true },
                },
            ],
        });

        // 整合worker-loader
        config.module.rules.push({
            test: /\.worker\.js$/,
            use: [
                {
                    loader: "worker-loader",
                },
            ],
        });
        let pluginsDev = [
            new vConsolePlugin({
                filter: [],
                enable: true,
            }),
            // new PrerenderSPAPlugin({
            //     staticDir: path.resolve(__dirname, '../dist'),
            //     // outputDir: path.resolve(__dirname, '../dist'),
            //     // indexPath: path.resolve(__dirname, '../dist/index.html'),

            //     // 对应路由文件的path
            //     routes: [
            //         '/',
            //         '/m'
            //     ],

            //     renderer: new Renderer({
            //         headless: false, // 无桌面系统去掉
            //         renderAfterDocumentEvent: 'render-event',
            //         args: ['--no-sandbox', '--disable-setuid-sandbox']
            //     })
            // })
        ];
        if (IS_PROD) {
            if (["test", "gray"].includes(process.env.VUE_APP_MODE)) {
                config.plugins = [...config.plugins, ...pluginsDev];
            }

            return {
                plugins: [
                    new CompressionPlugin(
                        {
                            filename: info => {
                                return `${info.path}.gz${info.query}`
                            },
                            test: /\.js$|\.html$|.\css$/, // 匹配文件
                            threshold: 10240, // 超过10kB的数据进行压缩
                            deleteOriginalAssets: false, // 是否删除原文件 （原文件也建议发布到服务器以支持不兼容gzip的浏览器）
                            minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
                            algorithm: "gzip"
                        },
                        new vConsolePlugin({
                            filter: [],
                            enable: true,
                        })
                    ),
                    // new SentryWebpackPlugin({
                    //     include: './dist',
                    //     ignoreFile: '.sentrycliignore',
                    //     ignore: ['node_modules', 'webpack.config.js'],
                    //     configFile: 'sentry.properties',
                    //     release: `tank-app-h5 ${version}`  // sourcemap的名字
                    // })
                ],
                performance: {
                    // 生产环境构建代码文件超出以下配置大小会在命令行中显示警告
                    hints: "warning",
                    // 入口起点的最大体积 整数类型（以字节为单位,默认值是：250000 (bytes)）
                    maxEntrypointSize: 5000000,
                    // 生成文件的最大体积 整数类型（以字节为单位,默认值是：250000 (bytes)）
                    maxAssetSize: 3000000,
                    // // 只给出 js 文件的性能提示
                    // assetFilter: function (assetFilename) {
                    //   return assetFilename.endsWith('.js')
                    // }
                },
            };
        } else {
            config.plugins = [...config.plugins, ...pluginsDev];
        }
    },
    // 链式webpack
    chainWebpack: config => {
        // config.optimization.minimize(true);

        config.optimization.splitChunks({
            chunks: 'all'
        })

        // config.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin)
        // config.entry('main').add('babel-polyfill');
        config.entry.app = ['babel-polyfill', './src/main.js'];
        config.resolve.symlinks(true);
        const types = ["vue-modules", "vue", "normal-modules", "normal"];
        types.forEach((type) => {
            const rule = config.module.rule("less").oneOf(type);
            addStyleResource(rule);
        });

        config.plugin("html").tap((args) => {
            args[0].title = "坦克营地";
            return args;
        });

        config.module
            .rule("js")
            .test(/\.js$/)
            .use("babel-loader")
            .loader("babel-loader")
            .end()

        config.plugins.delete("prefetch");
        config.plugins.delete("preload");
        config.resolve.alias.set("vue$", "vue/dist/vue.esm.js");
        config.resolve.alias.set("@", resolve("src"));
        config.resolve.alias.set("tools", resolve("src/tools"));
        config.resolve.alias.set("components", resolve("src/components"));
        config.resolve.alias.set("views", resolve("src/views"));
        config.resolve.alias.set("animate", resolve("src/assets/animate"));
        config.resolve.alias.set("imgs", resolve("src/assets/imgs"));
        config.resolve.alias.set("styles", resolve("src/assets/styles"));
        config.resolve.alias.set("api", resolve("src/api"));
    },
    // 服务设置(待确定)
    devServer: {
        host: '0.0.0.0',
        disableHostCheck: true,
        proxy: {
            "/api": {
                target: "https://beta-tank-box.wg.360.cn", // 目标代理接口地址
                // target: "https://tbox.wot.360.cn", // 目标代理接口地址
                secure: false,
                changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
                pathRewrite: {
                    "^/api": "/"
                }
            },
            '/ac': {
                target: "http://demoapi.wg.360.cn/", // 目标代理接口地址
                secure: false,
                changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
                pathRewrite: {
                    "^/ac": "/"
                }
            }
        }
    }
}

function addStyleResource(rule) {
    rule
        .use("style-resource")
        .loader("style-resources-loader")
        .options({
            patterns: [
                path.resolve(__dirname, "./src/assets/styles/var.less"),
                path.resolve(__dirname, "./src/assets/styles/mixins.less"),
            ],
        });
}