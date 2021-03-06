"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const constant_1 = require("../common/constant");
const DEFAULT_CONFIG = {
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '\\.(css|less|scss)$': constant_1.JEST_STYLE_MOCK_FILE,
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': constant_1.JEST_FILE_MOCK_FILE,
    },
    setupFilesAfterEnv: [constant_1.JEST_SETUP_FILE],
    moduleFileExtensions: ['js', 'jsx', 'vue', 'ts', 'tsx'],
    transform: {
        '\\.(vue)$': 'vue3-jest',
        '\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    transformIgnorePatterns: ['/node_modules/(?!(@vant/cli))/'],
    snapshotSerializers: ['jest-serializer-html'],
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx,vue}',
        '!**/demo/**',
        '!**/test/**',
    ],
    coverageReporters: ['html', 'lcov', 'text-summary'],
    coverageDirectory: './test/coverage',
};
function readRootConfig() {
    const ROOT_CONFIG_PATH = (0, path_1.join)(constant_1.ROOT, 'jest.config.js');
    if ((0, fs_extra_1.existsSync)(ROOT_CONFIG_PATH)) {
        return require(ROOT_CONFIG_PATH);
    }
    return {};
}
module.exports = {
    ...DEFAULT_CONFIG,
    ...readRootConfig(),
};
