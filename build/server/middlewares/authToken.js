"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenVerify = void 0;
const sqlServer_1 = require("../services/sqlServer");
const table = '[CHECKLIST].[dbo].[UserToken]';
const tokenVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authHeader = req.header('Authorization');
        if (authHeader === undefined) {
            console.log('Error');
            console.log(authHeader);
            throw new Error('No se encontró la api key en la petición');
        }
        const token = authHeader.split(' ')[1];
        if (token === undefined) {
            throw new Error('No se encontró token en la petición.');
        }
        const queryAuthToken = `SELECT * FROM ${table} WHERE token = '${token}'`;
        const resutlAuthToken = yield (0, sqlServer_1.querySQL)(queryAuthToken);
        const rowsAuthToken = (_a = resutlAuthToken === null || resutlAuthToken === void 0 ? void 0 : resutlAuthToken.data) === null || _a === void 0 ? void 0 : _a.rowsAffected[0];
        if (Number(rowsAuthToken) > 0)
            next();
        else
            res.status(401).json({ message: 'Token no valido' });
    }
    catch (e) {
        res.status(401).json({ message: String(e) });
    }
});
exports.tokenVerify = tokenVerify;
