import { Compiler } from 'webpack';
export declare function genSiteEntry(): Promise<void>;
export declare class VantCliSitePlugin {
    apply(compiler: Compiler): void;
}
