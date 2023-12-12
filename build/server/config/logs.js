"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logs = void 0;
const path_1 = __importDefault(require("path"));
const logsPath = path_1.default.resolve(__dirname, '../../logs');
exports.logs = {
    apiPath: path_1.default.join(`${logsPath}`, 'api.txt')
};
