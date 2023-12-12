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
exports.saveManyChecklist = exports.listAllCheckList = void 0;
const sqlServer_1 = require("./sqlServer");
const table = 'CheckList';
const listAllCheckList = () => __awaiter(void 0, void 0, void 0, function* () {
    const { success, message, data } = yield (0, sqlServer_1.listAllFilds)(table);
    if (success) {
        return { success, message: 'Datos del checklist listado.', data };
    }
    else
        return { success, message, data };
});
exports.listAllCheckList = listAllCheckList;
const saveManyChecklist = (object) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, sqlServer_1.saveManyFields)(table, object);
    return response;
});
exports.saveManyChecklist = saveManyChecklist;
