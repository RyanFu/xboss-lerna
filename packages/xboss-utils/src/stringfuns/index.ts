/**
 * 字符信息处理相关
 * @packageDocumentation
 * @module stringfuns
 * @preferred
 */

import { isEmpty } from '../commonfuns';
import { isMobilephone, isEmail } from '../validatefuns';

/**
 * 空值处理
 * @param {any} value 传入的值
 * @param {string} [defaultValue = '-'] 空值默认返回值
 * @return {boolean} true 为空值
 * @example
 * ``` typescript
 * 1. formatEmptyValue('') => '-'
 * 2. formatEmptyValue(null, '/') => '/'
 */
export function formatEmptyValue(value: any, defaultValue: string = '-'): any {
  if (isEmpty(value)) {
    return defaultValue;
  }
  return value;
}

/**
 * 去掉前后空格
 * @param {any} str 传入的字符串
 * @return {string} 处理后的字符串
 * @example
 * ``` typescript
 * 1. trimVal('') => ''
 * 2. trimVal('  test   ') => 'test'
 */
export function trimVal(str: string): string {
  if (isEmpty(str)) {
    return str;
  }
  const reg = /^\s+|\s+$/g;
  return str.replace(reg, '');
}

/**
 * 格式化手机号码
 * @param {string | number} phone 传入的手机号码
 * @param {string} [separator = ' '] 连接符
 * @param {string} [defaultValue = '-'] 默认返回值
 * @return {string} 格式化后的手机号码
 * @example
 * ``` typescript
 * 1. phoneFormat('') => '-'
 * 2. phoneFormat('10086') => '10086'
 * 3. phoneFormat('13427540588') => '134 2754 0588'
 * 4. phoneFormat('13427540588') => '134-2754-0588'
 */
export function phoneFormat(
  phone: string | number,
  separator: string = ' ',
  defaultValue: string = '-'
): string {
  if (isEmpty(phone)) return defaultValue;
  if (!isMobilephone(phone)) return String(phone);
  const val = phone.toString().replace(/[^\d]/g, '');
  const arr = val.split('');
  let str = '';
  arr.forEach((v, index) => {
    if (index === 3 || index === 7) {
      str += separator;
    }
    str += v;
  });
  return str;
}

/**
 * 格式化银行卡
 * @param {string | number} phone 传入的银行卡号
 * @param {string} [defaultValue = '-'] 默认返回值
 * @return {string} 格式化后的银行卡号
 * @example
 * ``` typescript
 * 1. bankFormat('') => '-'
 * 2. bankFormat('6282356862823568123') => '6282 3568 6282 3568 123'
 */
export function bankFormat(
  value: string | number,
  defaultValue: string = '-'
): string {
  if (isEmpty(value)) return defaultValue;
  return value
    .toString()
    .replace(/\s/g, '')
    .replace(/(.{4})/g, '$1 ');
}

/**
 * 手机号加密
 * @param {string | number} phone 传入的手机号码
 * @param {string} [separator = ' '] 连接符
 * @param {string} [defaultValue = '-'] 默认返回值
 * @return {string} 加密后的手机号码
 * @example
 * ``` typescript
 * 1. phoneEncryption('') => '-'
 * 2. phoneEncryption(13475481) => '13475481'
 * 3. phoneEncryption(13427540581) => '134****0581'
 */
export function phoneEncryption(
  phone: string | number,
  defaultValue: string = '-'
): string {
  if (isEmpty(phone)) return defaultValue;
  if (!isMobilephone(phone)) return String(phone);
  const phoneReg = /(\d{3})\d*(\d{4})/;
  const phoneStr = String(phone).replace(phoneReg, '$1****$2');
  return phoneStr;
}

/**
 * 邮箱加密
 * @param {string | number} email 传入的邮箱
 * @param {string} [defaultValue = '-'] 默认返回值
 * @return {string} 加密后的邮箱
 * @example
 * ``` typescript
 * 1. emailEncryption('') => '-'
 * 2. emailEncryption('www.vau.com') => 'www.vau.com'
 * 3. emailEncryption('377162714@qq.com') => '3771627*****.com'
 */
export function emailEncryption(
  email: string,
  defaultValue: string = '-'
): string {
  if (isEmpty(email)) return defaultValue;
  if (!isEmail(email)) return email;
  const emailStrList = email.split('@');
  const emailStr = `${emailStrList[0].substr(
    0,
    emailStrList[0].length - 2
  )}*****${emailStrList[1].substr(2)}`;
  return emailStr;
}

/**
 * 关键信息加密（打印时，隐藏手机号、供应商等信息统一处理，只显示前后一位）
 * @param {string | number} value 传入的关键信息
 * @param {string} [defaultValue = '-'] 默认返回值
 * @return {string} 加密后的关键信息
 * @example
 * ``` typescript
 * 1. infoEncryption('') => '-'
 * 2. infoEncryption('www.vau.com') => 'w****m'
 */

export function infoEncryption(
  value: string | number,
  defaultValue: string = '-'
): string {
  if (isEmpty(value)) return defaultValue;
  const strRes = String(value);
  return `${strRes.substr(0, 1)}****${strRes.substr(
    strRes.length - 1,
    strRes.length
  )}`;
}

/**
 * 生成26个字母列表
 * @param {boolean} [Upper = true] 是否输出大写字母
 * @return {string[]} 26个字母
 * @example
 * ``` typescript
 * 1. generateEnglishLetters() => ['A', ..., 'Z']
 * 2. generateEnglishLetters(false) => ['a', ..., 'z']
 */
function generateEnglishLetters(Upper: boolean = true): string[] {
  const englishLettersList: string[] = [];
  for (let i = 65; i < 91; i += 1) {
    const letter = Upper
      ? String.fromCharCode(i)
      : String.fromCharCode(i).toLowerCase();
    englishLettersList.push(letter);
  }
  return englishLettersList;
}

/**
 * 驼峰转大写('-' 隔开)
 * @param {string} str 驼峰写法字符转
 * @param {string} [defaultValue = '-'] 默认返回值
 * @return {string} 26个字母
 * @example
 * ``` typescript
 * 1. generateEnglishLetters() => ['A', ..., 'Z']
 * 2. generateEnglishLetters(false) => ['a', ..., 'z']
 */

export function camelToLine(str: string, defaultValue: string = '-'): string {
  if (isEmpty(str)) return defaultValue;
  return str.replace(/([A-Z])/g, '-$1').toUpperCase();
}

export default {
  formatEmptyValue,
  trimVal,
  phoneFormat,
  bankFormat,
  phoneEncryption,
  emailEncryption,
  infoEncryption,
  generateEnglishLetters,
  camelToLine,
};
