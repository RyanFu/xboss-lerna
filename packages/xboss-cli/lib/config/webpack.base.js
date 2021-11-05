"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseConfig = void 0;
const sass_1 = __importDefault(require("sass"));
const webpack_1 = __importDefault(require("webpack"));
const vue_loader_1 = require("vue-loader");
const path_1 = require("path");
const logger_1 = require("../common/logger");
const fs_1 = require("fs");
const constant_1 = require("../common/constant");
const CSS_LOADERS = [
    require.resolve('style-loader'),
    require.resolve('css-loader'),
    {
        loader: require.resolve('postcss-loader'),
        options: {
            postcssOptions: require(constant_1.POSTCSS_CONFIG_FILE),
        },
    },
];
const VUE_LOADER = {
    loader: require.resolve('vue-loader'),
    options: {
        compilerOptions: {
            preserveWhitespace: false,
        },
    },
};
const plugins = [
    new webpack_1.default.DefinePlugin({
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
    }),
    new vue_loader_1.VueLoaderPlugin(),
];
const tsconfigPath = (0, path_1.join)(constant_1.CWD, 'tsconfig.json');
if ((0, fs_1.existsSync)(tsconfigPath)) {
    const ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin');
    plugins.push(new ForkTsCheckerPlugin({
        typescript: {
            extensions: {
                vue: {
                    enabled: true,
                    compiler: '@vue/compiler-sfc',
                },
            },
        },
        logger: {
            issues: {
                // skip info message
                log() { },
                warn(message) {
                    logger_1.consola.warn(message);
                },
                error(message) {
                    logger_1.consola.error(message);
                },
            },
        },
    }));
}
exports.baseConfig = {
    mode: 'development',
    resolve: {
        extensions: [...constant_1.SCRIPT_EXTS, ...constant_1.STYLE_EXTS],
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [VUE_LOADER],
            },
            {
                test: /\.(js|ts|jsx|tsx)$/,
                exclude: /node_modules\/(?!(@vant\/cli))/,
                use: [require.resolve('babel-loader')],
            },
            {
                test: /\.css$/,
                sideEffects: true,
                use: CSS_LOADERS,
            },
            {
                test: /\.less$/,
                sideEffects: true,
                use: [...CSS_LOADERS, require.resolve('less-loader')],
            },
            {
                test: /\.scss$/,
                sideEffects: true,
                use: [
                    ...CSS_LOADERS,
                    {
                        loader: require.resolve('sass-loader'),
                        options: {
                            implementation: sass_1.default,
                        },
                    },
                ],
            },
            {
                test: /\.md$/,
                use: [VUE_LOADER, require.resolve('@vant/markdown-loader')],
            },
        ],
    },
    plugins,
    cache: {
        type: 'filesystem',
        buildDependencies: {
            config: [__filename],
        },
    },
};
