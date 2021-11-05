"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileSite = void 0;
const webpack_1 = __importDefault(require("webpack"));
const webpack_dev_server_1 = __importDefault(require("webpack-dev-server"));
const lodash_1 = require("lodash");
const portfinder_1 = require("portfinder");
const webpack_site_dev_1 = require("../config/webpack.site.dev");
const webpack_site_prd_1 = require("../config/webpack.site.prd");
async function runDevServer(port, config) {
    const host = (0, lodash_1.get)(config.devServer, 'host', 'localhost');
    const server = new webpack_dev_server_1.default({
        ...config.devServer,
        port,
        host,
    }, (0, webpack_1.default)(config));
    await server.start();
}
async function watch() {
    const config = (0, webpack_site_dev_1.getSiteDevConfig)();
    const port = await (0, portfinder_1.getPortPromise)({
        port: config.devServer.port,
    });
    await runDevServer(port, config);
}
function build() {
    return new Promise((resolve, reject) => {
        const config = (0, webpack_site_prd_1.getSitePrdConfig)();
        (0, webpack_1.default)(config, (err, stats) => {
            if (err || (stats && stats.hasErrors())) {
                reject();
            }
            else {
                resolve();
            }
        });
    });
}
async function compileSite(production = false) {
    if (production) {
        await build();
    }
    else {
        await watch();
    }
}
exports.compileSite = compileSite;
