"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genPackageStyle = void 0;
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const common_1 = require("../common");
const css_1 = require("../common/css");
const constant_1 = require("../common/constant");
function genPackageStyle(options) {
    const styleDepsJson = require(constant_1.STYLE_DEPS_JSON_FILE);
    const ext = '.' + css_1.CSS_LANG;
    let content = '';
    let baseFile = (0, css_1.getCssBaseFile)();
    if (baseFile) {
        if (options.pathResolver) {
            baseFile = options.pathResolver(baseFile);
        }
        content += `@import "${(0, common_1.normalizePath)(baseFile)}";\n`;
    }
    content += styleDepsJson.sequence
        .map((name) => {
        let path = (0, path_1.join)(constant_1.SRC_DIR, `${name}/index${ext}`);
        if (!(0, fs_extra_1.existsSync)(path)) {
            return '';
        }
        if (options.pathResolver) {
            path = options.pathResolver(path);
        }
        return `@import "${(0, common_1.normalizePath)(path)}";`;
    })
        .filter((item) => !!item)
        .join('\n');
    (0, common_1.smartOutputFile)(options.outputPath, content);
}
exports.genPackageStyle = genPackageStyle;
