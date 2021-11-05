/**
 * 路由数据处理相关
 * @packageDocumentation
 * @module routefuns
 * @preferred
 */

/**
 * 获取地址栏hash部分
 * @returns {string} url地址hash部分
 * @example
 * ```typescript
 * 1. https://dev1-yun.ibaibu.com/#/sample-demand/pattern/list?name=xxx → getHash() => '/sample-demand/pattern/list?name=xxx'
 */
export function getHash(): string {
  let { href } = window.location;
  const index = href.indexOf('#');
  if (index < 0) return '';
  href = href.slice(index + 1);
  return href;
}

/**
 * 获取地址栏path部分
 * @returns {string} url地址path部分
 * @example
 * ```typescript
 * 1. https://dev1-yun.ibaibu.com/#/sample-demand/pattern/list?name=xxx → getPath() => '/sample-demand/pattern/list'
 */
 export function getPath(): string {
  let path = getHash();
  const queryIndex = path.indexOf('?');
  if (queryIndex >= 0) {
    path = path.substring(0, queryIndex);
  }
  return path;
}


/**
 * 获取地址栏Query部分(对象形式)
 * @returns {string | null} url地址参数部分(对象形式)
 * @example
 * ```typescript
 * 1. https://dev1-yun.ibaibu.com/#/sample-demand/pattern/list?name=xxx&age=123 → getQueryObject() => {name: 'xxx', age: '123'}
 * 2. https://dev1-yun.ibaibu.com/#/sample-demand/pattern/list?name=aaa&name=bbb → getQueryObject() => {name: ['aaa', 'bbb']}
 */
export function getQueryObject() {
  const hash = getHash();
  if (hash.indexOf('?') === -1) return null;
  const params = hash.split('?')[1];
  const param = params.split('&');
  const obj: any = {};
  for (let i = 0; i < param.length; i++) {
    const paramsA = param[i].split('=');
    const key = paramsA[0];
    const value = paramsA[1];
    if (obj[key]) {
      obj[key] = Array.isArray(obj[key]) ? obj[key] : [obj[key]];
      obj[key].push(value);
    } else {
      obj[key] = value;
    }
  }
  return obj;
}

export default {
  getHash,
  getPath,
  getQueryObject,
};
