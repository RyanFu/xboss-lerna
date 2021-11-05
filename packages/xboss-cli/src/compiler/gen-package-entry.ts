import { get } from 'lodash';
import { join } from 'path';
import {
  pascalize,
  getComponents,
  smartOutputFile,
  normalizePath,
} from '../common';
import { SRC_DIR, getPackageJson, getVantConfig } from '../common/constant';

type PathResolver = (path: string) => string;

function getPathByName(name: string, pathResolver?: PathResolver) {
  let path = join(SRC_DIR, name);
  if (pathResolver) {
    path = pathResolver(path);
  }
  return normalizePath(path);
}

function genImports(
  names: string[],
  pathResolver?: PathResolver,
  namedExport?: boolean
): string {
  return names
    .map((name) => {
      const pascalName = pascalize(name);
      const importName = namedExport ? `{ ${pascalName} }` : pascalName;
      const importPath = getPathByName(name, pathResolver);

      return `import ${importName} from '${importPath}';`;
    })
    .join('\n');
}

function genExports(
  names: string[],
  pathResolver?: PathResolver,
  namedExport?: boolean
): string {
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
    ${names.map(pascalize).join(',\n  ')}
  };
  `;
}

export function genPackageEntry({
  outputPath,
  pathResolver,
}: {
  outputPath: string;
  pathResolver?: PathResolver;
}) {
  // 通过遍历src目录下文件，如果是index.{vue、tsx、js、tsx、ts} 文件，并且有默认导出export default之类的，就收集起来
  // 例如现在names值为['demo-button']
  const names = getComponents();
  const vantConfig = getVantConfig();

  const namedExport = get(vantConfig, 'build.namedExport', false);
  const skipInstall = get(vantConfig, 'build.skipInstall', []).map(pascalize);
  const version = process.env.PACKAGE_VERSION || getPackageJson().version;

  // 把名字转为pascalize 例如：demo-button 转为 DemoButton
  const components = names.map(pascalize);
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

  smartOutputFile(outputPath, content);
}
