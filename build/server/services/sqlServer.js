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
exports.deleteField = exports.listAllFilds = exports.listFildsOrderBy = exports.listFilds = exports.updateField = exports.saveManyFields = exports.saveField = exports.querySQL = void 0;
const mssql_1 = __importDefault(require("mssql"));
const database_1 = __importDefault(require("../config/database"));
const objectToSql_1 = require("../utils/objectToSql");
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    let connection;
    try {
        connection = yield mssql_1.default.connect(database_1.default);
        return {
            success: true,
            message: 'Conectado a la base de datos con exito',
            connection
        };
    }
    catch (e) {
        return {
            success: false,
            message: 'No se ha podido conectar a la base de datos'
        };
    }
});
const querySQL = (sql) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const db = yield connectDB();
    console.log(sql);
    if (db.success) {
        try {
            const Result = yield ((_a = db.connection) === null || _a === void 0 ? void 0 : _a.query(sql));
            return { success: true, message: 'Query realizada', data: Result };
        }
        catch (err) {
            return { success: false, message: (_c = (_b = err === null || err === void 0 ? void 0 : err.originalError) === null || _b === void 0 ? void 0 : _b.info) === null || _c === void 0 ? void 0 : _c.message };
        }
    }
    else
        return { success: false, message: db.message };
});
exports.querySQL = querySQL;
/**
 * Función asincrónica para guardar un objeto en una tabla de la base de datos
 * @param table - nombre de la tabla en la que se guardarán los datos
 * @param object - objeto con los datos que se guardarán en la tabla
 * @returns - objeto con información sobre si la operación fue exitosa o no, y un mensaje
 */
const saveField = (table, object) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    let columnString = '';
    let valuesString = '';
    const keys = Object.keys(object);
    keys.map((itemKey) => {
        // dependiendo del tipo de valor le agrega ' ' o convierte los booleanos en 1 o 0
        switch (typeof (object[itemKey])) {
            case 'string':
                valuesString += "'" + object[itemKey] + "',";
                break;
            case 'boolean':
                valuesString += object[itemKey] == 'true' || object[itemKey] == true ? '1,' : '0,';
                break;
            default:
                valuesString += object[itemKey] + ',';
                break;
        }
        columnString += itemKey + ',';
    });
    // le quita la ultima coma al texto de los valores y campos
    const valuesStringWithoutLast = valuesString.slice(0, -1);
    const columnStringWithoutLast = columnString.slice(0, -1);
    const query = `INSERT INTO ${table} (${columnStringWithoutLast}) VALUES (${valuesStringWithoutLast});`;
    const executedQuery = yield (0, exports.querySQL)(query);
    if (executedQuery.success) {
        return {
            success: true,
            message: 'Datos guardados con exito'
        };
    }
    else {
        if ((_d = executedQuery === null || executedQuery === void 0 ? void 0 : executedQuery.message) === null || _d === void 0 ? void 0 : _d.includes('PK_UserToken')) {
            return {
                success: false,
                message: 'El elemento que desea guardar, se encuentra repetido por Primary Key. Values: ' + valuesStringWithoutLast
            };
        }
        else
            return {
                success: false,
                message: executedQuery.message
            };
    }
});
exports.saveField = saveField;
/**
 * Función asincrónica para guardar varios objetos en una tabla de la base de datos
 * @param table - nombre de la tabla en la que se guardarán los datos
 * @param object - array de objetos con los datos que se guardarán en la tabla
 * @returns - objeto con información sobre si la operación fue exitosa o no, y un mensaje
 */
const saveManyFields = (table, object) => __awaiter(void 0, void 0, void 0, function* () {
    for (let itemObject of object) {
        const savedData = yield (0, exports.saveField)(table, itemObject);
        if (!savedData.success)
            return {
                success: false,
                message: savedData.message
            };
    }
    return {
        success: true,
        message: 'Grupo de elementos guardados con exito'
    };
});
exports.saveManyFields = saveManyFields;
const updateField = (table, objectValues, objectWhere) => __awaiter(void 0, void 0, void 0, function* () {
    const keysobjectValues = Object.keys(objectValues);
    const keysobjectWhere = Object.keys(objectWhere);
    const querySET = (0, objectToSql_1.objectInLine)(keysobjectValues, objectValues);
    const queryWhere = (0, objectToSql_1.objectInLine)(keysobjectWhere, objectWhere);
    const query = `UPDATE ${table} SET ${querySET} WHERE ${queryWhere};`;
    const executedQuery = yield (0, exports.querySQL)(query);
    if (executedQuery.success) {
        return { success: true, message: 'Datos actualizados con exito' };
    }
    return { success: false, message: executedQuery.message };
});
exports.updateField = updateField;
const listFilds = (table, columnsArray, objectWhere) => __awaiter(void 0, void 0, void 0, function* () {
    let columns = ' ';
    // concatena las columnas de la consulta y les coloca un ',' al final
    columnsArray === null || columnsArray === void 0 ? void 0 : columnsArray.map((item) => columns += item + ',');
    // toma las keys del objeto del where de la consulta 
    if (Object.keys(objectWhere !== null && objectWhere !== void 0 ? objectWhere : {}).length >= 1 && columnsArray != undefined) {
        const keysObjectWhere = Object.keys(objectWhere !== null && objectWhere !== void 0 ? objectWhere : {});
        //convierte el objeto en formato value sql ej. key = 'value'
        const whereValues = (0, objectToSql_1.objectInLineWhere)(keysObjectWhere, objectWhere, 'AND');
        // concatena la consulta quitandole la ultima ',' al string de columnas
        const query = `SELECT ${columns.slice(0, -1)} FROM ${table} WHERE ${whereValues};`;
        const queryResult = yield (0, exports.querySQL)(query);
        if (queryResult.success) {
            return { success: true, data: queryResult.data, message: queryResult.message };
        }
        else
            return { success: false, data: undefined, message: queryResult.message };
    }
    else
        return {
            success: false,
            message: 'Se debe ingresar columnas a filtrar y los valores de referencia para el filtro.'
        };
});
exports.listFilds = listFilds;
const listFildsOrderBy = (table, columnsArray, objectWhere, orderBy, order, between = '') => __awaiter(void 0, void 0, void 0, function* () {
    let columns = ' ';
    let orderByString = '';
    orderBy.map((item, index) => {
        orderByString += `${item} ${order[index]},`;
    });
    //Agrega AND si existen columnas en la consulta
    const betweenAND = Object.keys(objectWhere).length > 0 ? 'AND' : '';
    between = between !== '' ? `${between} ${betweenAND}` : '';
    // concatena las columnas de la consulta y les coloca un ',' al final
    columnsArray === null || columnsArray === void 0 ? void 0 : columnsArray.map((item) => columns += item + ',');
    // toma las keys del objeto del where de la consulta 
    const keysObjectWhere = Object.keys(objectWhere !== null && objectWhere !== void 0 ? objectWhere : {});
    //convierte el objeto en formato value sql ej. key = 'value'
    const whereValues = (0, objectToSql_1.objectInLineWhere)(keysObjectWhere, objectWhere, 'AND');
    console.log(whereValues);
    // concatena la consulta quitandole la ultima ',' al string de columnas
    const query = `SELECT ${columns.slice(0, -1)} FROM ${table} WHERE ${between} ${whereValues} ORDER BY ${orderByString.substring(0, orderByString.length - 1)};`;
    console.log(query);
    const queryResult = yield (0, exports.querySQL)(query);
    if (queryResult.success) {
        return { success: true, data: queryResult.data, message: queryResult.message };
    }
    else
        return { success: false, data: undefined, message: queryResult.message };
});
exports.listFildsOrderBy = listFildsOrderBy;
const listAllFilds = (table) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const query = `SELECT * FROM ${table};`;
    const queryResult = yield (0, exports.querySQL)(query);
    if (queryResult.success) {
        return { success: true, data: (_e = queryResult.data) === null || _e === void 0 ? void 0 : _e.recordset, message: queryResult.message };
    }
    else
        return { success: false, data: {}, message: queryResult.message };
});
exports.listAllFilds = listAllFilds;
const deleteField = (table, where) => __awaiter(void 0, void 0, void 0, function* () {
    const keys = Object.keys(where);
    const whereQuery = (0, objectToSql_1.objectInLine)(keys, where);
    const query = `DELETE FROM ${table} WHERE ${whereQuery};`;
    const { success, message } = yield (0, exports.querySQL)(query);
    if (success) {
        return { success, message: 'Infromación eliminada con exito' };
    }
    else
        return { success, message };
});
exports.deleteField = deleteField;
