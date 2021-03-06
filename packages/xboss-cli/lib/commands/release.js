"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.release = void 0;
/* eslint-disable no-template-curly-in-string */
const release_it_1 = __importDefault(require("release-it"));
const path_1 = require("path");
const PLUGIN_PATH = (0, path_1.join)(__dirname, '../compiler/vant-cli-release-plugin.js');
async function release(command) {
    await (0, release_it_1.default)({
        plugins: {
            [PLUGIN_PATH]: {},
        },
        npm: {
            tag: command.tag,
        },
        git: {
            tagName: 'v${version}',
            commitMessage: 'release: ${version}',
        },
    });
}
exports.release = release;
