/**
 * 打印处理相关
 * @packageDocumentation
 * @module printfuns
 * @preferred
 * @see https://juejin.im/post/5de4f87cf265da05c7722c20
 */

/**
 * 获取、设置打印样式
 * @returns style
 * @ignore
 */
function getStyle() {
  const styleContent = `#print-container {
      display: none;
    }
    @media print {
      body > :not(.print-container) {
        display: none;
      }
      html,
      body {
        display: block !important;
      }
      #print-container {
        display: block;
      }
  }`;
  const style = document.createElement('style');
  style.innerHTML = styleContent;
  return style;
}

/**
 * 清空打印内容
 * @ignore
 */
function cleanPrint() {
  const div = document.getElementById('print-container');
  if (div) {
    document.querySelector('body')!.removeChild(div);
  }
}

/**
 * 新建DOM，将需要打印的内容填充到DOM
 * @param {*} html
 * @returns
 * @ignore
 */
function getContainer(html: any) {
  cleanPrint();
  const container = document.createElement('div');
  container.setAttribute('id', 'print-container');
  container.innerHTML = html;
  return container;
}

/**
 * 图片完全加载后再调用打印方法
 * @param {*} dom
 * @returns
 * @ignore
 */
function getLoadPromise(dom: any) {
  let imgs = dom.querySelectorAll('img');
  imgs = [].slice.call(imgs);

  if (imgs.length === 0) {
    return Promise.resolve();
  }

  let finishedCount = 0;
  return new Promise<void>((resolve) => {
    function check() {
      finishedCount += 1;
      if (finishedCount === imgs.length) {
        resolve();
      }
    }
    imgs.forEach((img: any) => {
      img.addEventListener('load', check);
      img.addEventListener('error', check);
    });
  });
}

/**
 * 打印指定HTML片段
 * @param {*} html 传入的html片段
 * @example
 * ``` typescript
 * const html = document.getElementById('return-print')!.innerHTML;
   printHtml(html);
 */
function printHtml(html: any) {
  const style = getStyle();
  const container = getContainer(html);

  document.body.appendChild(style);
  document.body.appendChild(container);

  getLoadPromise(container).then(() => {
    window.print();
    document.body.removeChild(style);
    document.body.removeChild(container);
  });
}

export default { printHtml };
