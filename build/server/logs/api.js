"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const date_1 = require("../utils/date");
const logs_1 = require("../config/logs");
const file = logs_1.logs.apiPath;
const logApi = (route, error, object) => {
    const { dateToday, now } = (0, date_1.today)();
    const errString = `[${dateToday} - ${now}] Path: '${route}' Error: ${error} \ndataObject: ${JSON.stringify(object)} \n`;
    fs_1.default.appendFileSync(file, errString);
};
exports.default = logApi;
