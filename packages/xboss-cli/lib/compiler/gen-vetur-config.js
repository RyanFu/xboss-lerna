"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genVeturConfig = void 0;
const markdown_vetur_1 = __importDefault(require("@vant/markdown-vetur"));
const lodash_1 = require("lodash");
const constant_1 = require("../common/constant");
// generate vetur tags & attributes
function genVeturConfig() {
    const pkgJson = (0, constant_1.getPackageJson)();
    const vantConfig = (0, constant_1.getVantConfig)();
    const options = (0, lodash_1.get)(vantConfig, 'build.vetur');
    if (options) {
        markdown_vetur_1.default.parseAndWrite({
            name: vantConfig.name,
            path: constant_1.SRC_DIR,
            test: /zh-CN\.md/,
            version: pkgJson.version,
            outputDir: constant_1.VETUR_DIR,
            ...options,
        });
    }
}
exports.genVeturConfig = genVeturConfig;
