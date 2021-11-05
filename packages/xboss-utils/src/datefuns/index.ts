/**
 * 时间处理相关
 * @packageDocumentation
 * @module datefuns
 * @preferred
 */

import { isEmpty } from '../commonfuns';

/**
 * 调用原生 new Date 返回 Date实例
 * @param {string | number | Date} endTime 比较时间
 * @returns {Date} Date实例
 * @example
 * ```typescript
 * 1. newDate('2021-5-22') => new Date('2021-5-22');
 * 2. newDate(1621679101000) => new Date(1621679101000);
 */
export function newDate(date?: string | number | Date): Date {
  if (!date) return new Date();
  if (typeof date === 'string') {
    date = date.replace(/-/g, '/');
  }
  return new Date(date);
}

/**
 * 格式化时间
 * @param {string | number | Date} date 时间
 * @param {string} [fmt='yyyy-MM-dd HH:mm:ss'] 格式
 * @description fmt格式 M-月 d-日 H-小时(24小时制) h-小时(12小时制) m-分 s-秒 q-季度 S-毫秒
 * @returns {string} 格式化后时间
 * @example
 * ```typescript
 * 1. formatTime(1622025138000) => '2021-05-26 18:32:18';
 * 2. formatTime(1622025138000, 'yyyy-MM-dd') => '2021-05-26';
 * 3. formatTime(1622025138000, 'YYYY-MM-DD') => '2021-05-26';
 * 4. formatTime(1622025138000, 'yyyy-MM-dd hh:mm:ss') => '2021-05-26 06:32:18';
 * 5. formatTime(1622025138000, 'yyyy-MM-dd q') => '2021-05-26 2';
 * 6. formatTime(1622025138022, 'HH:mm:ss S') => '18:32:18 22';
 */
export function formatTime(
  date: string | number | Date,
  fmt: string = 'yyyy-MM-dd HH:mm:ss'
): string {
  if (!date) {
    return '';
  }
  date = newDate(date);
  const o: any = {
    'M+': date.getMonth() + 1, // 月份
    'D+': date.getDate(), // 日
    'd+': date.getDate(), // 日
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  };

  if (/([y,Y]+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      `${date.getFullYear()}`.substr(4 - RegExp.$1.length)
    );
  }

  Object.keys(o).forEach((k) => {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length)
      );
    }
  });

  return fmt;
}

/**
 * 获取相对时间(多久前)
 * @param {string | number | Date} time 时间
 * @param {string} [fmt='yyyy-MM-dd HH:mm:ss'] 格式
 * @description fmt格式 M-月 d-日 H-小时(24小时制) h-小时(12小时制) m-分 s-秒 q-季度 S-毫秒
 * @param {string} [defaultValue = '-'] 默认返回值
 * @returns {string} 相对时间
 * @example
 * ```typescript
 * 1. fromNow(new Date()) => '刚刚';
 * 2. fromNow(new Date(new Date().getTime() - (5 * 60 * 60 * 1000))) => '5小时前';
 * 3. fromNow(new Date(new Date().getTime() - (24 * 60 * 60 * 1000))) => '1天前';
 * 4. fromNow('2046-10-10') => '2046-10-10 00:00:00';
 */
export function fromNow(
  time: string | number | Date,
  fmt: string = 'yyyy-MM-dd HH:mm:ss',
  defaultValue: string = '-'
): string {
  if (isEmpty(time)) {
    return defaultValue;
  }
  const d = newDate(time);
  const now = Date.now();
  const diff = (now - d.getTime()) / 1000;
  if (diff < 0) {
    console.warn(`${time} more than the current time`);
    return formatTime(time, fmt);
  }
  if (diff < 30) {
    return '刚刚';
  }
  if (diff < 3600) {
    return `${Math.ceil(diff / 60)}分钟前`;
  }
  if (diff < 3600 * 24) {
    return `${Math.floor(diff / 3600)}小时前`;
  }
  if (diff < 3600 * 24 * 2) {
    return '1天前';
  }
  return formatTime(time, fmt);
}

/**
 * 跳到指定日期的n天前后
 * @param {string | number | Date} startDate 时间
 * @param {string | number} days 跳几天(小数会向下取整)
 * @param {string} [defaultValue = '-'] 默认返回值
 * @returns {string} n天后日期
 * @example
 * ```typescript
 * 1. jumpDays(2012-2-28', 10) => '2012-03-09';
 * 2. jumpDays('2012-3-10', -20') => '2012-02-19';
 * 3. jumpDays(1622025138022, -20) => '2021-05-06';
 * 4. jumpDays('2012-2-28', 1.5) => '2012-02-29';
 */
export function jumpDays(
  startDate: string | number | Date,
  days: string | number,
  defaultValue: string = '-'
): string {
  if (isEmpty(startDate) || isEmpty(days)) {
    return defaultValue;
  }
  const d = newDate(startDate);
  d.setDate(d.getDate() + Math.floor(Number(days)));
  let mon: string | number = d.getMonth() + 1;
  let day: string | number = d.getDate();
  mon = mon < 10 ? `0${mon}` : mon;
  day = day < 10 ? `0${day}` : day;
  return `${d.getFullYear()}-${mon}-${day}`;
}


export default { newDate, formatTime, fromNow, jumpDays };
