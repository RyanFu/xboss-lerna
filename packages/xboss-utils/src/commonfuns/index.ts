/**
 * 实用函数
 * @packageDocumentation
 * @module commonfuns
 * @preferred
 */

/**
 * 判断value是否为空值
 * @param {any} value 传入的参数
 * @return {boolean} true 为空值
 * @example
 * ``` typescript
 * 1. isEmpty('') => true
 * 2. isEmpty(null) => true
 * 3. isEmpty(undefined) => true
 * 4. isEmpty(12323) => false
 */
export function isEmpty(value: any): boolean {
  return value === null || value === '' || value === undefined;
}

/**
 * 判断是否为函数
 * @param {any} value 任意值
 * @returns {boolean} 判断结果
 * ``` typescript
 * 1. isFunc('test') => false
 * 2. isFunc(function test() {}) => true
 */
export function isFunc(value: any): boolean {
  return typeof value === 'function';
}

interface Idevice {
  isAndroid: boolean;
  isIOS: boolean;
}
/**
 * 根据设备信息 判断 Android & Ios
 * @return {Idevice} 是否安卓、IOS
 * @example
 * ``` typescript
 * 1. PC - getDevice() => {isAndroid: false, isIOS: false}
 * 2. 安卓 - getDevice() => {isAndroid: true, isIOS: false}
 * 3. IOS - getDevice() => {isAndroid: false, isIOS: true}
 */
export function getDevice(): Idevice {
  const u = navigator.userAgent;
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
  const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  return {
    isAndroid,
    isIOS,
  };
}

/**
 * 比较两者的值是否相等
 * @param {any} x 用来比较的值
 * @param {any} y 另一个用来比较的值
 * @return {boolean} true相等
 * @example
 * ``` typescript
 * 1. deepEqual('2', '3') => false
 * 2. deepEqual({a:1,b:2}, {a:1,b:2}) => true
 * 3. deepEqual([1,2,3], [2,3,4]) => false
 */
export function deepEqual(x: any, y: any): boolean {
  const ok = Object.keys,
    tx = typeof x,
    ty = typeof y;
  return x && y && tx === 'object' && tx === ty
    ? ok(x).length === ok(y).length &&
        ok(x).every(key => deepEqual(x[key], y[key]))
    : x === y;
}

type THandler<T> = (value: T, index: number, array: T[]) => unknown;
/**
 * promise迭代器
 * @param {T[]} list promise函数列表
 * @param {THandler<T>} handler 回调函数
 * @return {any} res回应结果
 */
async function promiseIterator<T>(list: T[], handler: THandler<T>) {
  const _handler = isFunc(handler)
    ? handler
    : (cb: T) => {
        return isFunc(cb) ? (cb as unknown as () => T)() : cb;
      };
  const res = await Promise.all(list.map(_handler as THandler<T>));
  return res;
}

/**
 * @name: 枚举类型转Array
 * @param enumObj 枚举对象
 */

/**
 * 枚举类型转换Array
 * @param {any} enumObj 枚举
 * @return {{ label: '1', value: 'A' }[]} 属性对象数组
 * @example
 * ``` typescript
 * enum TEST_ENUM {A = '1',B = '2'}
 * 1. enumToArray(TEST_ENUM) => [{ label: '1', value: 'A' }, { label: '2', value: 'B' }
 */

export function enumToArray(enumObj: { [key: string]: any; }) {
  const arr = Object.keys(enumObj).map((key) => {
    return {
      value: key,
      label: enumObj[key],
    };
  });

  return arr;
}

export default {
  isEmpty,
  isFunc,
  getDevice,
  deepEqual,
  promiseIterator,
  enumToArray,
};
