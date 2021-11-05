/**
 * 数字处理相关
 * @packageDocumentation
 * @module numberfuns
 * @preferred
 */

import { isEmpty } from '../commonfuns';
import NP from 'number-precision';

/**
 * 千分位格式化
 * @param {number | string} num 要处理的数字
 * @param {string} [defaultValue = '-'] 默认返回值
 * @return {string} 千分位格式化后的数字
 * @example
 * ``` typescript
 * 1. toThousands(1) => '1'
 * 2. toThousands(12345) => '12,345'
 * 3. toThousands('12323.12') => '12,323.12'
 */
export function toThousands(
  num: number | string,
  defaultValue: string = '-'
): string {
  if (isEmpty(num)) return defaultValue;
  let value = String(num);
  if (!value.includes('.')) value += '.';
  return value
    .replace(/\d(?=(\d{3})+\.)/g, $0 => `${$0},`)
    .replace(/\.$/, '');
}

/**
 * 阿拉伯数字转中文数字
 * @param {number | string} value 要处理的金额数字
 * @return {string} 转换后的金额数字
 * @example
 * ``` typescript
 * 1. arabicNum2chineseNum('') => ''
 * 2. arabicNum2chineseNum(0) => '零元整'
 * 3. arabicNum2chineseNum(10000000.111) => '零元整'
 * 4. arabicNum2chineseNum(1000000000000000) => '1000000000000000'
 */
export function arabicNum2chineseNum(value: number | string): string {
  const maxNum = 999999999999999.9999; // 最大处理的数字
  if (isEmpty(value)) {
    return '';
  }
  // 超出最大处理数字
  if (Number(value) >= maxNum) {
    return String(value);
  }
  const cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const cnIntRadice = ['', '拾', '佰', '仟'];
  const cnIntUnits = ['', '万', '亿', '兆']; // 对应整数部分扩展单位
  const cnDecUnits = ['角', '分', '毫', '厘']; // 对应小数部分单位
  const cnInteger = '整'; // 整数金额时后面跟的字符
  const cnIntLast = '元'; // 整型完以后的单位
  let integerNum; // 金额整数部分
  let decimalNum; // 金额小数部分
  let chineseStr = ''; // 输出的中文金额字符串
  let parts; // 分离金额后用的数组，预定义
  const money = String(parseFloat(String(value)));
  if (money === '0') {
    chineseStr = cnNums[0] + cnIntLast + cnInteger;
    return chineseStr;
  }
  if (money.indexOf('.') === -1) {
    integerNum = money;
    decimalNum = '';
  } else {
    parts = money.split('.');
    integerNum = parts[0];
    decimalNum = parts[1].substr(0, 4);
  }
  // 获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    let zeroCount = 0;
    const intLen = integerNum.length;
    for (let i = 0; i < intLen; i += 1) {
      const n = integerNum.substr(i, 1);
      const p = intLen - i - 1;
      const q = p / 4;
      const m = p % 4;
      if (n === '0') {
        zeroCount += 1;
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0];
        }
        // 归零
        zeroCount = 0;
        chineseStr += cnNums[parseInt(n, 10)] + cnIntRadice[m];
      }
      if (m === 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q];
      }
    }
    chineseStr += cnIntLast;
  }
  // 小数部分
  if (decimalNum !== '') {
    const decLen = decimalNum.length;
    for (let i = 0; i < decLen; i += 1) {
      const dn = decimalNum.substr(i, 1);
      if (dn !== '0') {
        chineseStr += cnNums[Number(dn)] + cnDecUnits[i];
      }
    }
  }
  if (chineseStr === '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger;
  } else if (decimalNum === '') {
    chineseStr += cnInteger;
  }
  return chineseStr;
}

/**
 * 格式化小数位
 * @param {number | string} value 要处理的小数数字
 * @param { round?: boolean; pos?: number; } param  round——是否四舍五入(默认-true) pos——保留的小数位(默认-2)
 * @return {string} 格式化后的数字
 * @example
 * ``` typescript
 * 1. formatFloat('1.2355') => '1.24'
 * 2. formatFloat('1.2355', { round: false }) => '1.23'
 * 3. formatFloat('1.2345', { pos: 3 }) => '1.235'
 * 4. formatFloat('1.2345', { round: false, pos: 3 }) => '1.234'
 * 5. formatFloat('1', { pos: 3 }) => '1.000'
 */

export function formatFloat(
  value: number | string,
  param?: { round?: boolean; pos?: number; }
): string {
  const round: boolean =
    param && !isEmpty(param.round) ? (param.round as boolean) : true;
  const pos: number = param && !isEmpty(param.pos) ? (param.pos as number) : 2;
  let f = parseFloat(String(value));
  if (Number.isNaN(f)) {
    return '';
  }
  const val = Number(value);
  const swell = Math.pow(10, pos);
  f = round
    ? NP.round(val, pos)
    : NP.divide(Math.floor(NP.times(val, swell)), swell);

  let s = f.toString();
  let rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + pos) {
    s += '0';
  }
  return s;
}

/**
 * 向上取整
 * @param {number | string} value 要处理的数字
 * @param {number} [pos = 0] 保留的小数位
 * @return {string} 格式化后的数字
 * @example
 * ``` typescript
 * 1. ceil('1.2345') => '1.23'
 * 2. ceil('1.2345', 3) => '1.235'
 * 3. ceil('1', 3) => '1.000'
 */
export function ceil(value: number | string, pos = 0): string | number {
  if (isEmpty(value)) {
    return '';
  }
  const swell = Math.pow(10, pos);
  const swellVal = NP.times(Number(value), swell);
  const newVal = NP.divide(Math.ceil(swellVal), swell);
  return newVal;
}

/**
 * 向下取整
 * @param {number | string} value 要处理的数字
 * @param {number} [pos = 0] 保留的小数位
 * @return {string} 格式化后的数字
 * @example
 * ``` typescript
 * 1. floor('1.23') => 1
 * 2. floor('1.234', 2) => 1.23
 * 3. floor('1.230', 3) => 1.230
 */
export function floor(value: number | string, pos = 0): string | number {
  if (isEmpty(value)) {
    return '';
  }
  const swell = Math.pow(10, pos);
  const swellVal = NP.times(Number(value), swell);
  return NP.divide(Math.floor(swellVal), swell);
}

export default { toThousands, arabicNum2chineseNum, formatFloat, ceil, floor };
