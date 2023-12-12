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
exports.userRol = exports.delteUser = exports.listUsers = exports.updateUser = exports.createUser = exports.userAuthentication = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sqlServer_1 = require("./sqlServer");
const sqlServer_2 = require("./sqlServer");
const table = '[CHECKLIST].[dbo].[UserToken]';
const getUserToken = (isCorrect, usuario) => __awaiter(void 0, void 0, void 0, function* () {
    if (isCorrect) {
        const generedToken = jsonwebtoken_1.default.sign({ foo: 'bar' }, 'shhhhh');
        const resultUpdate = yield (0, sqlServer_2.updateField)(table, { token: generedToken }, { usuario });
        if (resultUpdate.success) {
            return { success: true, token: generedToken, message: resultUpdate.message };
        }
        else
            return { success: false, token: undefined, message: resultUpdate.message };
    }
    else
        return { success: false, token: undefined, message: 'Credenciales incorrectas' };
});
const userAuthentication = ({ usuario, clave }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const queryClave = yield (0, sqlServer_2.listFilds)(table, ['clave', 'rol'], { usuario });
    const errorText = 'Credenciales incorrectas';
    if (queryClave.success) {
        const rowsQuery = (_a = queryClave === null || queryClave === void 0 ? void 0 : queryClave.data) === null || _a === void 0 ? void 0 : _a.rowsAffected[0];
        if (Number(rowsQuery) > 0) {
            const userPass = (_c = (_b = queryClave === null || queryClave === void 0 ? void 0 : queryClave.data) === null || _b === void 0 ? void 0 : _b.recordset[0]) === null || _c === void 0 ? void 0 : _c.clave;
            const rol = (_e = (_d = queryClave === null || queryClave === void 0 ? void 0 : queryClave.data) === null || _d === void 0 ? void 0 : _d.recordset[0]) === null || _e === void 0 ? void 0 : _e.rol;
            const isCorrect = yield bcrypt_1.default.compare(clave, String(userPass));
            const { success, token, message } = yield getUserToken(isCorrect, usuario);
            return { success, token, message, rol };
        }
        else
            return { success: false, rol: undefined, token: undefined, message: errorText };
    }
    else
        return { success: false, rol: undefined, token: undefined, message: queryClave.message };
});
exports.userAuthentication = userAuthentication;
const createUser = ({ usuario, clave, rol }) => __awaiter(void 0, void 0, void 0, function* () {
    const userHashPass = yield bcrypt_1.default.hash(clave, 10);
    const data = {
        usuario,
        clave: userHashPass,
        rol
    };
    const dataSaved = yield (0, sqlServer_1.saveField)(table, data);
    if (dataSaved.success) {
        return {
            success: dataSaved.success,
            message: 'Usuario creado satisfactoriamente'
        };
    }
    else
        return {
            success: dataSaved.success,
            message: 'No se ha podido guardar la información. Error: ' + dataSaved.message
        };
});
exports.createUser = createUser;
const updateUser = (objectValues, objectWhere, password) => __awaiter(void 0, void 0, void 0, function* () {
    let updateData = objectValues;
    if (password != undefined) {
        const userHashPass = yield bcrypt_1.default.hash(password, 10);
        updateData = Object.assign(Object.assign({}, updateData), { clave: userHashPass });
    }
    const updatedData = yield (0, sqlServer_2.updateField)(table, updateData, objectWhere);
    if (updatedData.success) {
        return { success: true, message: 'Usuario actualizado con exito' };
    }
    else
        return { success: false, message: 'Error al actualizar el usuario Error: ' + updatedData.message };
});
exports.updateUser = updateUser;
const listUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const { success, data, message } = yield (0, sqlServer_2.listAllFilds)(table);
    if (success) {
        return { success, data, message };
    }
    else
        return {
            data: null,
            success,
            message: 'No se ha podido listar los usuarios. Error:' + message
        };
});
exports.listUsers = listUsers;
const delteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, message } = yield (0, sqlServer_2.deleteField)(table, { id });
    if (success) {
        return { success, message: 'Usuario eliminado satisfactoriamente' };
    }
    return { success, message };
});
exports.delteUser = delteUser;
const userRol = (userAdmin) => __awaiter(void 0, void 0, void 0, function* () {
    const columns = ['rol'];
    const where = {
        usuario: userAdmin
    };
    const { success, data, message } = yield (0, sqlServer_2.listFilds)(table, columns, where);
    if (success)
        return { success, data };
    else
        return { success, message };
});
exports.userRol = userRol;
