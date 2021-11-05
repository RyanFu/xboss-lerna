"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commitLint = exports.buildSite = exports.changelog = exports.release = exports.build = exports.clean = exports.test = exports.lint = exports.dev = exports.cliVersion = void 0;
// @ts-ignore
const package_json_1 = __importDefault(require("../package.json"));
const dev_1 = require("./commands/dev");
Object.defineProperty(exports, "dev", { enumerable: true, get: function () { return dev_1.dev; } });
const lint_1 = require("./commands/lint");
Object.defineProperty(exports, "lint", { enumerable: true, get: function () { return lint_1.lint; } });
const jest_1 = require("./commands/jest");
Object.defineProperty(exports, "test", { enumerable: true, get: function () { return jest_1.test; } });
const clean_1 = require("./commands/clean");
Object.defineProperty(exports, "clean", { enumerable: true, get: function () { return clean_1.clean; } });
const build_1 = require("./commands/build");
Object.defineProperty(exports, "build", { enumerable: true, get: function () { return build_1.build; } });
const release_1 = require("./commands/release");
Object.defineProperty(exports, "release", { enumerable: true, get: function () { return release_1.release; } });
const changelog_1 = require("./commands/changelog");
Object.defineProperty(exports, "changelog", { enumerable: true, get: function () { return changelog_1.changelog; } });
const build_site_1 = require("./commands/build-site");
Object.defineProperty(exports, "buildSite", { enumerable: true, get: function () { return build_site_1.buildSite; } });
const commit_lint_1 = require("./commands/commit-lint");
Object.defineProperty(exports, "commitLint", { enumerable: true, get: function () { return commit_lint_1.commitLint; } });
exports.cliVersion = package_json_1.default.version;
process.env.VANT_CLI_VERSION = exports.cliVersion;
