"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileSfc = exports.parseSfc = void 0;
const hash_sum_1 = __importDefault(require("hash-sum"));
const path_1 = __importDefault(require("path"));
const compiler_sfc_1 = require("@vue/compiler-sfc");
const fs_extra_1 = require("fs-extra");
const common_1 = require("../common");
const compile_js_1 = require("./compile-js");
const compile_style_1 = require("./compile-style");
const RENDER_FN = '__vue_render__';
const VUEIDS = '__vue_sfc__';
const EXPORT = 'export default';
// trim some unused code
function trim(code) {
    return code.replace(/\/\/\n/g, '').trim();
}
function getSfcStylePath(filePath, ext, index) {
    const number = index !== 0 ? `-${index + 1}` : '';
    return (0, common_1.replaceExt)(filePath, `-sfc${number}.${ext}`);
}
// inject render fn to script
function injectRender(script, render) {
    script = trim(script);
    render = render.replace('export function render', `function ${RENDER_FN}`);
    script += `\n${render}\n${VUEIDS}.render = ${RENDER_FN} \n`;
    return script;
}
function injectScopeId(script, scopeId) {
    script += `\n${VUEIDS}._scopeId = '${scopeId}'`;
    return script;
}
function injectStyle(script, styles, filePath) {
    if (styles.length) {
        const imports = styles
            .map((style, index) => {
            const { base } = path_1.default.parse(getSfcStylePath(filePath, 'css', index));
            return `import './${base}';`;
        })
            .join('\n');
        script = `${imports}\n${script}`;
        return script;
    }
    return script;
}
function parseSfc(filename) {
    const source = (0, fs_extra_1.readFileSync)(filename, 'utf-8');
    const { descriptor } = (0, compiler_sfc_1.parse)(source, {
        filename,
    });
    return descriptor;
}
exports.parseSfc = parseSfc;
async function compileSfc(filePath) {
    const tasks = [(0, fs_extra_1.remove)(filePath)];
    const source = (0, fs_extra_1.readFileSync)(filePath, 'utf-8');
    // 调用 @vue/compiler-sfc 把sfc解析template、style
    const descriptor = parseSfc(filePath);
    const { template, styles } = descriptor;
    // 如果是局部样式，生成scopeId
    const hasScoped = styles.some((s) => s.scoped);
    const scopeId = hasScoped ? `data-v-${(0, hash_sum_1.default)(source)}` : '';
    // 编译script节点
    if (descriptor.script) {
        const lang = descriptor.script.lang || 'js';
        const scriptFilePath = (0, common_1.replaceExt)(filePath, `.${lang}`);
        tasks.push(new Promise((resolve, reject) => {
            let script = descriptor.script.content;
            script = injectStyle(script, styles, filePath);
            script = script.replace(EXPORT, `const ${VUEIDS} =`);
            if (template) {
                const render = (0, compiler_sfc_1.compileTemplate)({
                    id: scopeId,
                    source: template.content,
                    filename: filePath,
                }).code;
                script = injectRender(script, render);
            }
            if (scopeId) {
                script = injectScopeId(script, scopeId);
            }
            script += `\n${EXPORT} ${VUEIDS}`;
            (0, fs_extra_1.writeFileSync)(scriptFilePath, script);
            (0, compile_js_1.compileJs)(scriptFilePath).then(resolve).catch(reject);
        }));
    }
    // compile style part
    tasks.push(...styles.map((style, index) => {
        const cssFilePath = getSfcStylePath(filePath, style.lang || 'css', index);
        const styleSource = trim(style.content);
        // TODO support scoped
        // if (style.scoped) {
        //   styleSource = compileUtils.compileStyle({
        //     id: scopeId,
        //     scoped: true,
        //     source: styleSource,
        //     filename: cssFilePath,
        //     preprocessLang: style.lang,
        //   }).code;
        // }
        (0, fs_extra_1.writeFileSync)(cssFilePath, styleSource);
        return (0, compile_style_1.compileStyle)(cssFilePath);
    }));
    return Promise.all(tasks);
}
exports.compileSfc = compileSfc;
