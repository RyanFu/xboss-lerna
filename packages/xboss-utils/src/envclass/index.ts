/**
 * 环境判断相关
 * @packageDocumentation
 * @module envclass
 * @preferred
 */

// 环境枚举
export enum DOMAIN_ENV_ENUM {
  /**
   * 开发环境1
   */
  dev1 = 'dev1',
  /**
   * 开发环境2
   */
  dev2 = 'dev2',
  /**
   * 开发环境3
   */
  dev3 = 'dev3',
  /**
   * 测试环境1
   */
  qa1 = 'qa1',
  /**
   * 测试环境2
   */
  qa2 = 'qa2',
  /**
   * 测试环境3
   */
  qa3 = 'qa3',
  /**
   * 验收环境1
   */
  uat1 = 'uat1',
  /**
   * 验收环境2
   */
  uat2 = 'uat2',
  /**
   * 验收环境3
   */
  uat3 = 'uat3',
  /**
   * 合规环境
   */
  hg = 'hg',
  /**
   * 灰度环境
   */
  preprod = 'preprod',
  /**
   * 生产环境
   */
  prod = 'prod',
}

// process.env.env 环境枚举
export enum PROCESS_ENV_ENUM {
  /**
   * 开发环境1
   */
  dev1 = 'dev1',
  /**
   * 开发环境2
   */
  dev2 = 'dev2',
  /**
   * 开发环境3
   */
  dev3 = 'dev3',
  /**
   * 测试环境1
   */
  qa1 = 'qa1',
  /**
   * 测试环境2
   */
  qa2 = 'qa2',
  /**
   * 测试环境3
   */
  qa3 = 'qa3',
  /**
   * 验收环境1
   */
  uat1 = 'uat1',
  /**
   * 验收环境2
   */
  uat2 = 'uat2',
  /**
   * 验收环境3
   */
  uat3 = 'uat3',
  /**
   * 合规环境
   */
  hg = 'hg',
  /**
   * 灰度环境
   */
  preprod = 'preprod',
  /**
   * 生产环境
   */
  env = 'env',
}

// Jenkins + 域名
export type PROCESS_DOMAIN_ENV_ENUM = PROCESS_ENV_ENUM | DOMAIN_ENV_ENUM;

// 域名所属系统
export enum DOMAIN_SYSTEM_ENUM {
  /**
   * 百布的统一域名
   */
  baibu = 'baibu',
  /**
   * 百布开放Api的统一域名
   */
  baibuOpenApi = 'baibuOpenApi',
  /**
   * 创新天工统一域名
   */
  tiangong = 'tiangong',
  /**
   * 图搜前端
   */
  imgSearchWeb = 'imgSearchWeb',

  /**
   * 百布旧bps
   */
  baibuBpsWeb = 'baibuBpsWeb',
  /**
   * 百布bps1
   */
  baibuBps1Web = 'baibuBps1Web',
  /**
   * 百布旧接口地址
   */
  baibuOldBpsApi = 'baibuOldBpsApi',
  /**
   * oss 静态资源服务地址
   */
  tiangongOssServer = 'tiangongOssServer',
  /**
   * 天工云版房系统
   */
  tiangongWeb = 'tiangongWeb',
  /**
   * 天工h5前端
   */
  tiangongWapp = 'tiangongWapp',
  /**
   * scm云版房系统
   */
  tiangongScmWeb = 'tiangongScmWeb',
  /**
   * 创新交易中心系统
   */
  tiangongTsWeb = 'tiangongTsWeb',
  /**
   * 创新COPY天工云版房系统
   */
  tiangongWebCopy = 'tiangongWebCopy',
  /**
  /**
   * 创新COPY天工h5前端
   */
  tiangongWappCopy = 'tiangongWappCopy',
  /**
   * 创新COPY交易中心系统
   */
  tiangongTsWebCopy = 'tiangongTsWebCopy',
}

// API_BASE 类型
export type T_API_BASE = {
  [key in DOMAIN_SYSTEM_ENUM]?: string;
};

// APIS 类型
type T_APIS = {
  [key in DOMAIN_ENV_ENUM]?: T_API_BASE;
} & {
  others: T_API_BASE;
};

/**
 * 获取当前环境（env）
 * @param processEnv {PROCESS_DOMAIN_ENV_ENUM} 环境变量 process.env.env的值
 * @param developmentEnv {DOMAIN_ENV_ENUM} 如果是开发环境会将 processEnv 设置为该值。
 * @param defaultMainDomain {string | undefined} 本地环境使用 默认 mainDomain 默认值：yunbanfang.cn
 * ``` typescript
 * new Env(PROCESS_ENV_ENUM.qa1, DOMAIN_ENV_ENUM.qa2) => {
 *   _developmentEnv: DOMAIN_ENV_ENUM.qa2,
 *   currentEnv: DOMAIN_ENV_ENUM.qa2,
 *   mainDomain: 'yunbanfang.cn',
 *   API_BASE: {
 *     tiangong: `https://${DOMAIN_ENV_ENUM.qa2}-api.yunbanfang.cn`,
 *   },
 *   env: DOMAIN_ENV_ENUM,
 *   getEnv: function,
 * }
 */

export class Env {
  /*
   * 开发环境默认使用 env
   * */
  readonly _developmentEnv: DOMAIN_ENV_ENUM;
  /*
   * 根据Jenkins & 判断最终确定的 env
   * */
  readonly currentEnv: DOMAIN_ENV_ENUM;
  /*
   * 接口对应系统对象
   * */
  readonly API_BASE: T_API_BASE;
  /*
   * 主域名，本地使用默认值，其他通过hostname获取
   * */
  readonly mainDomain: string;
  constructor(
    processEnv: PROCESS_ENV_ENUM,
    developmentEnv: DOMAIN_ENV_ENUM,
    defaultMainDomain = 'yunbanfang.cn'
  ) {
    /* 开发环境使用的Env */
    this._developmentEnv = developmentEnv;
    /* 实际返回的Env */
    this.currentEnv = this.getCurrentEnv(processEnv);
    this.mainDomain = this.getMainDomain(defaultMainDomain);

    // 生成API_BASE
    this.API_BASE = this.getApiBase();
  }
  /*
   * 1. 处理Jenkins 中的env 与 项目中实际使用的Eev 差异
   * 2. 开发环境 使用 _developmentEnv
   * */
  getCurrentEnv(processEnv: PROCESS_ENV_ENUM) {
    let processDomainEnv: PROCESS_DOMAIN_ENV_ENUM =
      processEnv || DOMAIN_ENV_ENUM.prod;
    // 兼容 Jenkins中 的生产使用的是 env， 域名配置 & 前端代码都使用的是 prod
    if (processEnv === PROCESS_ENV_ENUM.env) {
      processDomainEnv = DOMAIN_ENV_ENUM.prod;
    }

    // 最终确认的环境（接口环境配置）类型矫正。
    let env: DOMAIN_ENV_ENUM = processDomainEnv as DOMAIN_ENV_ENUM;

    // 开发环境直接使用 developmentEnv
    if (process.env.NODE_ENV === 'development') {
      env = this._developmentEnv;
    }
    return env;
  }
  /* 根据 hostname 获取 主域名 */
  getMainDomain(defaultMainDomain: string) {
    const { hostname } = window.location;
    const isLocal = /(^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$)|(^localhost$)/.test(
      hostname
    );

    const domains = hostname.split('.').reverse();
    return isLocal ? defaultMainDomain : `${domains[1]}.${domains[0]}`;
  }
  // 根据环境 获取apiBase
  getApiBase(): T_API_BASE {
    const APIS: T_APIS = {
      prod: {
        tiangong: `https://api.${this.mainDomain}`,
      },
      others: {
        tiangong: `https://${this.currentEnv}-api.${this.mainDomain}`,
      },
    };

    return APIS[this.currentEnv] || APIS.others;
  }
}
