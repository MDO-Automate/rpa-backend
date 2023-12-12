"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectInLineWhere = exports.objectInLine = exports.objectToInsertInto = exports.objectToBetween = void 0;
const objectToBetween = (campo, start, end) => {
    return `${campo} BETWEEN '${start}' AND '${end}'`;
};
exports.objectToBetween = objectToBetween;
/* Convierte un objecto en campos y valores para una consulta insert into con sus respectivos tipos de datos
para los valores a agregar.

`INSERT INTO ${table}(${columnStringWithoutLast}) VALUES(${valuesStringWithoutLast})`

parametros:
    object: objeto con la información de los campos a ingresar

*/
const objectToInsertInto = (object) => {
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
                valuesString += object[itemKey] == 'true' ? '1,' : '0,';
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
    return [valuesStringWithoutLast, columnStringWithoutLast];
};
exports.objectToInsertInto = objectToInsertInto;
// convierte un objeto a 'key=value' y lo devuelve en un string
const objectInLine = (keys, object) => {
    let value = '';
    let keyAndValues = '';
    keys.map((key) => {
        switch (typeof (object[key])) {
            case 'string':
                value += "'" + object[key] + "',";
                break;
            case 'boolean':
                value += object[key] == 'true' || object[key] == true ? '1,' : '0,';
                break;
            default:
                value += object[key] + ',';
                break;
        }
        keyAndValues += key + '=' + value;
        value = ' ';
    });
    return keyAndValues.slice(0, -1);
};
exports.objectInLine = objectInLine;
const objectInLineWhere = (keys, object, denotation) => {
    let value = '';
    let keyAndValues = '';
    keys.map((key) => {
        switch (typeof (object[key])) {
            case 'string':
                value += "'" + object[key] + "' " + denotation + ' ';
                break;
            case 'boolean':
                value += object[key] == 'true' || object[key] == true ? '1 ' + denotation + ' ' : '0 ' + denotation + ' ';
                break;
            default:
                value += object[key] + ' ' + denotation + ' ';
                break;
        }
        if (typeof (object[key]) == 'object' && object[key].hasOwnProperty('contains')) {
            keyAndValues += `${key} LIKE '%${object[key].contains}%'     AND `;
        }
        else
            keyAndValues += key + '=' + value;
        value = '';
    });
    return keyAndValues.slice(0, -4);
};
exports.objectInLineWhere = objectInLineWhere;
