"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
// @ts-ignore
const package_entry_1 = __importDefault(require("../../dist/package-entry"));
require("jest-canvas-mock");
window.vant = package_entry_1.default;
