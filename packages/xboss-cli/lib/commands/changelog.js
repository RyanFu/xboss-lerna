"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changelog = void 0;
const path_1 = require("path");
const constant_1 = require("../common/constant");
const logger_1 = require("../common/logger");
const fs_extra_1 = require("fs-extra");
const conventional_changelog_1 = __importDefault(require("conventional-changelog"));
const DIST_FILE = (0, path_1.join)(constant_1.ROOT, './changelog.generated.md');
const MAIN_TEMPLATE = (0, path_1.join)(__dirname, '../../template/changelog-main.hbs');
const HEADER_TEMPLATE = (0, path_1.join)(__dirname, '../../template/changelog-header.hbs');
const COMMIT_TEMPLATE = (0, path_1.join)(__dirname, '../../template/changelog-commit.hbs');
const mainTemplate = (0, fs_extra_1.readFileSync)(MAIN_TEMPLATE, 'utf-8');
const headerPartial = (0, fs_extra_1.readFileSync)(HEADER_TEMPLATE, 'utf-8');
const commitPartial = (0, fs_extra_1.readFileSync)(COMMIT_TEMPLATE, 'utf-8');
function formatType(type) {
    const MAP = {
        fix: 'Bug Fixes',
        feat: 'Feature',
        docs: 'Document',
        types: 'Types',
    };
    return MAP[type] || type;
}
function transform(item) {
    if (item.type === 'chore' || item.type === 'test') {
        return null;
    }
    item.type = formatType(item.type);
    if (item.hash) {
        item.shortHash = item.hash.slice(0, 6);
    }
    if (item.references.length) {
        item.references.forEach((ref) => {
            if (ref.issue && item.subject) {
                item.subject = item.subject.replace(` (#${ref.issue})`, '');
            }
        });
    }
    return item;
}
async function changelog() {
    const spinner = (0, logger_1.ora)('Generating changelog...').start();
    return new Promise((resolve) => {
        (0, conventional_changelog_1.default)({
            preset: 'angular',
            releaseCount: 2,
        }, null, null, null, {
            mainTemplate,
            headerPartial,
            commitPartial,
            transform,
        })
            .pipe((0, fs_extra_1.createWriteStream)(DIST_FILE))
            .on('close', () => {
            spinner.succeed(`Changelog generated at ${(0, logger_1.slimPath)(DIST_FILE)}`);
            resolve();
        });
    });
}
exports.changelog = changelog;
