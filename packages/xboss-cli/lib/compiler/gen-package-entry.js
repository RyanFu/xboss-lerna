"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genPackageEntry = void 0;
const lodash_1 = require("lodash");
const path_1 = require("path");
const common_1 = require("../common");
const constant_1 = require("../common/constant");
function getPathByName(name, pathResolver) {
    let path = (0, path_1.join)(constant_1.SRC_DIR, name);
    if (pathResolver) {
        path = pathResolver(path);
    }
    return (0, common_1.normalizePath)(path);
}
function genImports(names, pathResolver, namedExport) {
    return names
        .map((name) => {
        const pascalName = (0, common_1.pascalize)(name);
        const importName = namedExport ? `{ ${pascalName} }` : pascalName;
        const importPath = getPathByName(name, pathResolver);
        return `import ${importName} from '${importPath}';`;
    })
        .join('\n');
}
function genExports(names, pathResolver, namedExport) {
    if (namedExport) {
        const exports = names
            .map((name) => `export * from '${getPathByName(name, pathResolver)}';`)
            .join('\n');
        return `
  export {
    install,
    version,
  };
  ${exports}
`;
    }
    return `
  export {
    install,
    version,
    ${names.map(common_1.pascalize).join(',\n  ')}
  };
  `;
}
function genPackageEntry({ outputPath, pathResolver, }) {
    // 通过遍历src目录下文件，如果是index.{vue、tsx、js、tsx、ts} 文件，并且有默认导出export default之类的，就收集起来
    // 例如现在names值为['demo-button']
    const names = (0, common_1.getComponents)();
    const vantConfig = (0, constant_1.getVantConfig)();
    const namedExport = (0, lodash_1.get)(vantConfig, 'build.namedExport', false);
    const skipInstall = (0, lodash_1.get)(vantConfig, 'build.skipInstall', []).map(common_1.pascalize);
    const version = process.env.PACKAGE_VERSION || (0, constant_1.getPackageJson)().version;
    // 把名字转为pascalize 例如：demo-button 转为 DemoButton
    const components = names.map(common_1.pascalize);
    // genImports把组件依赖导入，例如import DemoButton from './demo-button';
    const content = `${genImports(names, pathResolver, namedExport)}

const version = '${version}';

function install(app) {
  const components = [
    ${components.filter((item) => !skipInstall.includes(item)).join(',\n    ')}
  ];

  components.forEach(item => {
    if (item.install) {
      app.use(item);
    } else if (item.name) {
      app.component(item.name, item);
    }
  });
}

${genExports(names, pathResolver, namedExport)}

export default {
  install,
  version
};
`;
    (0, common_1.smartOutputFile)(outputPath, content);
}
exports.genPackageEntry = genPackageEntry;
