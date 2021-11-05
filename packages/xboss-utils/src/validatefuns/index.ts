/**
 * 校验信息相关
 * @packageDocumentation
 * @module validatefuns
 * @preferred
 */

/**
 *校验 手机号码(2021年)
  规则: 以1为开头,第二个数[3-9],总共11位数
 * @param {string | number} value 传入的号码
 * @returns {boolean} 校验结果 true通过
 * @example
 * ```typescript
 * 1. isMobilephone('') => false
 * 2. isMobilephone('13427540588') => true
 * 3. isMobilephone('10086') => false
 */
export function isMobilephone(value: string | number) {
  const reg = /^1[3-9]\d{9}$/;
  return reg.test(String(value));
}

/**
 *校验 座机号码
 *规则: 必须带区号
 * @param {string | number} value 传入的号码
 * @returns {boolean} 校验结果 true通过
 * @example
 * ```typescript
 * 1. isTelephone('') => false
 * 2. isTelephone('020-81721643') => true
 * 3. isTelephone('10086') => false
 */
export function isTelephone(value: string | number) {
  const reg = /^0[1-9][0-9]{1,2}-[2-8][0-9]{6,7}$/;
  return reg.test(String(value));
}

/**
 * 校验 邮箱
 * @param {string} value 传入的参数
 * @return {boolean} 校验结果 true通过
 * @example
 * ``` typescript
 * 1. isEmail('') => false
 * 2. isEmail('377162714@qq.com') => true
 * 3. isEmail('outlook.com') => false
 */
export function isEmail(value: string): boolean {
  /* eslint-disable no-useless-escape */
  const reg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return reg.test(value);
}

/**
 * 校验 QQ
 * @param {string | number} value 传入的参数
 * @return {boolean} 校验结果 true通过
 * @example
 * ``` typescript
 * 1. isQQ('377162714') => true
 * 2. isQQ('01234567890') => false
 */
export function isQQ(value: string | number): boolean {
  const reg = /^[1-9][0-9]{4,9}$/gim;
  return reg.test(String(value));
}

/**
 * 校验 是否是外部网址
 * @param {string} path 网址url
 * @return {boolean} 校验结果 true通过
 * @example
 * ``` typescript
 * 1. isExternal('https://www.baidu.com/') => true
 * 2. isExternal('10.25.5.173:15000') => false
 */
export function isExternal(path: string): boolean {
  const reg = /^(https?:|mailto:|tel:)/;
  return reg.test(String(path));
}

/**
 * 校验 二代身份证
 * @param {string|number} value 身份证号码
 * @return {boolean} 校验结果 true通过
 * @example
 * ``` typescript
 * 1. isIDCardNo('440102199402281422') => true
 * 2. isIDCardNo('377162715') => false
 */
export function isIDCardNo(value: string | number): boolean {
  const reg =
    /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/;
  return reg.test(String(value));
}

/**
 * 判断是否是图片类型
 * @param {string} fileUrl 传入的文件全称
 * @return {boolean} true 为空值
 * @example
 * ``` typescript
 * 1. isPicture('test.jpg') => true
 * 2. isPicture('test.png') => true
 * 3. isPicture('test.txt') => false
 */
export function isPicture(fileUrl: string): boolean {
  const exts = ['jpg', 'jpeg', 'png', 'gif'];
  return exts.some(ext => fileUrl.toLowerCase().endsWith(`.${ext}`));
}


/**
 * 校验 网址URL
 * @param {string} url 网址
 * @return {boolean} 校验结果 true通过
 * @example
 * ``` typescript
 * 1. isURL('https://www.zhihu.com/hot') => true
 * 2. isURL('www.zhihu.com/hot') => false
 */
 export function isURL(url: string): boolean {
  const reg = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/;
  return reg.test(url);
}



export default {
  isMobilephone,
  isTelephone,
  isEmail,
  isQQ,
  isExternal,
  isIDCardNo,
  isPicture,
  isURL,
};
