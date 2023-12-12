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
exports.updateNovedad = exports.listNovedadOrderBy = exports.listNovedad = exports.createNovedad = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const sqlServer_1 = require("./sqlServer");
dotenv_1.default.config();
const TABLE = `[${process.env.DBNAME}].[dbo].[NovClasificadas]`;
//crea una novedad
const createNovedad = (novedad) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, message } = yield (0, sqlServer_1.saveField)(TABLE, novedad);
    if (success) {
        return {
            success: true,
            message: 'Novedad creada con exito'
        };
    }
    else
        return {
            success: false,
            message: 'No se pudo guardar la novedad: ' + message
        };
});
exports.createNovedad = createNovedad;
// Lista las novedades de forma filtrada.
const listNovedad = (columns, where) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, success, message } = yield (0, sqlServer_1.listFilds)(TABLE, columns, where);
    if (success) {
        return {
            data,
            message: 'datos listados exitosamente',
            success
        };
    }
    else
        return {
            message: 'No se ha podido listar la información. ERROR: ' + message,
            success
        };
});
exports.listNovedad = listNovedad;
const listNovedadOrderBy = (columns, where, orderby, order, between) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, success, message } = yield (0, sqlServer_1.listFildsOrderBy)(TABLE, columns, where, orderby, order, between);
    if (success) {
        return {
            data,
            message: 'datos listados exitosamente',
            success
        };
    }
    else
        return {
            message: 'No se ha podido listar la información. ERROR: ' + message,
            success
        };
});
exports.listNovedadOrderBy = listNovedadOrderBy;
const updateNovedad = (dataUpdate, where) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, message } = yield (0, sqlServer_1.updateField)(TABLE, dataUpdate, where);
    if (success) {
        return {
            message: 'Datos actualizados exitosamente',
            success
        };
    }
    else
        return {
            message: 'No se han podido acutalizar los datos. ERROR: ' + message,
            success
        };
});
exports.updateNovedad = updateNovedad;
