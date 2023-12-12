"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import sql from 'mssql'
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const configDB = {
    server: String(process.env.DBSERVER),
    port: Number(process.env.DBPORT),
    authentication: {
        type: 'default',
        options: {
            userName: String(process.env.DBUSER),
            password: String(process.env.DBPASS)
        }
    },
    options: {
        database: String(process.env.DBNAME),
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    }
};
exports.default = configDB;
