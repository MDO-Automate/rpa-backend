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
exports.rolAuthentication = exports.adminAuthentication = void 0;
const users_1 = require("../services/users");
const adminAuthentication = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const username = String(req.header('username')) || ' ';
    const { success, data } = yield (0, users_1.userRol)(username);
    if (success) {
        const rol = (_a = data === null || data === void 0 ? void 0 : data.recordset[0]) === null || _a === void 0 ? void 0 : _a.rol;
        if (rol == "Admin") {
            next();
        }
        else
            res.status(401).json({ error: 'Usuario no administrador' });
    }
    else
        res.status(401).json({ error: 'Usuario no encontrado' });
});
exports.adminAuthentication = adminAuthentication;
const rolAuthentication = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const username = String(req.header('username')) || ' ';
    const rol = String(req.header('rol')) || ' ';
    const { success, data } = yield (0, users_1.userRol)(username);
    if (success) {
        const rolUser = (_b = data === null || data === void 0 ? void 0 : data.recordset[0]) === null || _b === void 0 ? void 0 : _b.rol;
        if (rol == rolUser || rolUser == 'Admin') {
            next();
        }
        else
            res.status(401).json({ error: 'Rol de usuario no coincide' });
    }
    else
        res.status(400).json({ error: 'Usuario no encontrado' });
});
exports.rolAuthentication = rolAuthentication;
