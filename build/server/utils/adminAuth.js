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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuthentication = void 0;
const sqlServer_1 = require("../services/sqlServer");
const bcrypt_1 = __importDefault(require("bcrypt"));
/*
 Parametros:
    @table: tabla donde se hará la consulta
    @userAdmin: nombre de usuario administrador
    @claveAdmin: contraseña de usuario administrador
*/
const adminAuthentication = (userAdmin, claveAdmin) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const table = 'UserToken';
    const queryAdmin = `SELECT clave, rol FROM ${table} WHERE usuario = '${userAdmin}';`;
    const resultAdmin = yield (0, sqlServer_1.querySQL)(queryAdmin);
    const rowsResult = (_a = resultAdmin === null || resultAdmin === void 0 ? void 0 : resultAdmin.data) === null || _a === void 0 ? void 0 : _a.rowsAffected[0];
    if (Number(rowsResult) > 0) {
        const passAdmin = (_c = (_b = resultAdmin === null || resultAdmin === void 0 ? void 0 : resultAdmin.data) === null || _b === void 0 ? void 0 : _b.recordset[0]) === null || _c === void 0 ? void 0 : _c.clave;
        const rolAdmin = (_e = (_d = resultAdmin === null || resultAdmin === void 0 ? void 0 : resultAdmin.data) === null || _d === void 0 ? void 0 : _d.recordset[0]) === null || _e === void 0 ? void 0 : _e.rol;
        const isAdminPass = yield bcrypt_1.default.compare(String(claveAdmin), passAdmin);
        if (isAdminPass && rolAdmin == "Admin") {
            return { success: true, message: 'Usuario admnistrador' };
        }
        else
            return { success: false, message: 'Contraseña incorrecta o usuario sin rol administrador.' };
    }
    else
        return { success: false, message: 'No se ha encontrado el usuario.' };
});
exports.adminAuthentication = adminAuthentication;
