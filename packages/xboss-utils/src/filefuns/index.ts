/**
 * 文件处理相关
 * @packageDocumentation
 * @module filefuns
 * @preferred
 */

import { formatFloat } from '../numberfuns';

type FileSizeUnit =
  | 'B'
  | 'b'
  | 'KB'
  | 'kb'
  | 'MB'
  | 'mb'
  | 'GB'
  | 'gb'
  | 'TB'
  | 'tb';

interface FileSizeObject {
  size: number;
  unit: FileSizeUnit;
}

/**
 * 文件大小单位转换
 * @param {number} size 传入的参数
 * @param {FileSizeUnit} unit 传入的单位
 * @param {number} [pos = 2] 保留的小数位
 * @return {FileSizeObject} 转换后的大小，单位
 * @example
 * ``` typescript
 * 1. converFileSize(100) => { size: 100, unit: 'B' }
 * 2. converFileSize(1024) => { size: 1, unit: 'KB' }
 * 3. converFileSize(1024, 'KB') => { size: 1, unit: 'MB' }
 * 4. converFileSize(100000, 'GB') => { size: 97.66, unit: 'TB' }
 * 5. converFileSize(10.11111, 'TB', 3) => { size: 10.111, unit: 'TB' }
 */
function converFileSize(
  size: number,
  unit: FileSizeUnit = 'B',
  pos: number = 2
): FileSizeObject | false {
  if (size <= 0) return false;
  const unitList: Array<FileSizeUnit> = ['B', 'KB', 'MB', 'GB', 'TB'];
  let currentUnitIndex = unitList.indexOf(unit.toUpperCase() as FileSizeUnit);
  currentUnitIndex = currentUnitIndex === -1 ? 0 : currentUnitIndex;
  // todo 单位换算。
  while (size >= 1024 && currentUnitIndex < unitList.length) {
    if (currentUnitIndex >= unitList.length - 1 && size >= 1024) break;
    size = size / 1024;
    currentUnitIndex += 1;
  }
  return {
    size: Number(formatFloat(size, { pos })),
    unit: unitList[currentUnitIndex],
  };
}

/**
 * base64转换为Blob
 * @param {string} dataUrl 传入的base64值
 * @return {Blob} Blob对象
 * @example
 * ``` typescript
 * 1. dataURL2Blob('data:image/gif;base64,xxxx.....') => Blob对象
 */
function dataURL2Blob(dataUrl: string): Blob {
  const mime = (dataUrl.match(/:(.*?);/) as any)[1];
  const bytes = window.atob(dataUrl.split(',')[1]); // 去掉url的头，并转换为byte
  // 处理异常,将ascii码小于0的转换为大于0
  const ab = new ArrayBuffer(bytes.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < bytes.length; i += 1) {
    ia[i] = bytes.charCodeAt(i);
  }
  return new Blob([ab], { type: mime });
}

/**
 * Blob转换为base64
 * @param {Blob} blob 传入的blob对象
 * @return {any} base64
 * @example
 * ``` typescript
 * 1. blob2DataURL(Blob) => base64
 */
function blob2DataURL(blob: Blob): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e || !e.target) {
        reject(e);
      } else {
        resolve(e.target.result as string);
      }
    };
    reader.onerror = (err) => {
      reject(err);
    };
    reader.readAsDataURL(blob);
  });
}

export interface CompressImgScaleCallback {
  (w: number, h: number): number;
}
export interface CompressImgQualityCallback {
  (fileSize: number, scale: number, w: number, h: number): number;
}
/**
 * 压缩图片
 * @param file 图片
 * @param scaleCallback 宽高 压缩规则
 * @param qualityCallback 质量 压缩规则
 * @return {Promise<Blob>} 压缩后blob对象
 * @example
 * ``` typescript
 * 1. compressImg(Blob) => base64
 */
function compressImg(
  file: File,
  scaleCallback?: CompressImgScaleCallback,
  qualityCallback?: CompressImgQualityCallback
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const fileSize = parseFloat((file.size / 1024 / 1024).toString());
    const read = new FileReader();
    read.onload = (e: ProgressEvent<FileReader>) => {
      const img = new Image();
      img.onload = () => {
        // 读取图片宽高
        const w = img.width;
        const h = img.height;
        // 生成canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 处理函数返回的不是 number & NaN 类型的情况
        let scale = scaleCallback ? scaleCallback(w, h) : 1;
        if (Number.isNaN(scale) || typeof scale !== 'number') {
          scale = 1;
        }
        let quality = qualityCallback
          ? qualityCallback(fileSize, scale, w, h)
          : 1;
        if (Number.isNaN(quality) || typeof quality !== 'number') {
          quality = 1;
        }

        // 图片 缩放规则
        if (ctx) {
          const scaleW = parseInt((w * scale).toString(), 10);
          const scaleH = parseInt((h * scale).toString(), 10);
          // 创建属性节点
          canvas.setAttribute('width', scaleW.toString());
          canvas.setAttribute('height', scaleH.toString());
          ctx.drawImage(img, 0, 0, scaleW, scaleH);
        }
        // 图片质量 压缩
        const base64 = canvas.toDataURL(file.type, quality);

        resolve(dataURL2Blob(base64));
      };
      img.onerror = (evt: Event | string) => {
        reject(evt);
      };

      if (e.target) {
        img.src = e.target.result as string;
      }
    };

    read.onerror = (e: ProgressEvent<FileReader>) => {
      reject(e);
    };
    read.readAsDataURL(file);
  });
}

export default { converFileSize, dataURL2Blob, blob2DataURL, compressImg };
