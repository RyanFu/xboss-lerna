"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSiteDevConfig = exports.getSiteDevBaseConfig = void 0;
const webpackbar_1 = __importDefault(require("webpackbar"));
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const lodash_1 = require("lodash");
const path_1 = require("path");
const webpack_merge_1 = require("webpack-merge");
const webpack_base_1 = require("./webpack.base");
const common_1 = require("../common");
const vant_cli_site_plugin_1 = require("../compiler/vant-cli-site-plugin");
const constant_1 = require("../common/constant");
function getSiteDevBaseConfig() {
    const vantConfig = (0, common_1.getVantConfig)();
    const baiduAnalytics = (0, lodash_1.get)(vantConfig, 'site.baiduAnalytics');
    function getSiteConfig() {
        const siteConfig = vantConfig.site;
        if (siteConfig.locales) {
            return siteConfig.locales[siteConfig.defaultLang || 'en-US'];
        }
        return siteConfig;
    }
    function getTitle(config) {
        let { title } = config;
        if (config.description) {
            title += ` - ${config.description}`;
        }
        return title;
    }
    const siteConfig = getSiteConfig();
    const title = getTitle(siteConfig);
    const { htmlPluginOptions } = vantConfig.site;
    return (0, webpack_merge_1.merge)(webpack_base_1.baseConfig, {
        entry: {
            'site-desktop': [(0, path_1.join)(__dirname, '../../site/desktop/main.js')],
            'site-mobile': [(0, path_1.join)(__dirname, '../../site/mobile/main.js')],
        },
        devServer: {
            port: 8080,
            host: '0.0.0.0',
            allowedHosts: 'all',
            devMiddleware: {
                stats: 'errors-only',
                publicPath: '/',
            },
        },
        resolve: {
            alias: {
                'site-mobile-shared': constant_1.SITE_MOBILE_SHARED_FILE,
                'site-desktop-shared': constant_1.SITE_DESKTOP_SHARED_FILE,
            },
        },
        output: {
            chunkFilename: '[name].js',
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    chunks: {
                        chunks: 'all',
                        minChunks: 2,
                        minSize: 0,
                        name: 'chunks',
                    },
                },
            },
        },
        plugins: [
            new webpackbar_1.default({
                name: 'Vant Cli',
                color: constant_1.GREEN,
            }),
            new vant_cli_site_plugin_1.VantCliSitePlugin(),
            new html_webpack_plugin_1.default({
                title,
                logo: siteConfig.logo,
                description: siteConfig.description,
                chunks: ['chunks', 'site-desktop'],
                template: (0, path_1.join)(__dirname, '../../site/desktop/index.html'),
                filename: 'index.html',
                baiduAnalytics,
                ...htmlPluginOptions,
            }),
            new html_webpack_plugin_1.default({
                title,
                logo: siteConfig.logo,
                description: siteConfig.description,
                chunks: ['chunks', 'site-mobile'],
                template: (0, path_1.join)(__dirname, '../../site/mobile/index.html'),
                filename: 'mobile.html',
                baiduAnalytics,
                ...htmlPluginOptions,
            }),
        ],
    });
}
exports.getSiteDevBaseConfig = getSiteDevBaseConfig;
function getSiteDevConfig() {
    return (0, common_1.getWebpackConfig)(getSiteDevBaseConfig());
}
exports.getSiteDevConfig = getSiteDevConfig;
