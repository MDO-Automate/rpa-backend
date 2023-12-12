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
const express_1 = __importDefault(require("express"));
const checkList_1 = require("../services/checkList");
const authToken_1 = require("../middlewares/authToken");
const checkListRoute = (0, express_1.default)();
// Petición GET con todos los datos
checkListRoute.get('/', authToken_1.tokenVerify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, checkList_1.listAllCheckList)();
    if (response.success) {
        res.status(200).json({ data: response.data });
    }
    else
        res.status(400).json({ error: response.message });
}));
checkListRoute.post('/', authToken_1.tokenVerify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //recoge el body de la petición
    const dataCheckList = req.body;
    const { success, message } = yield (0, checkList_1.saveManyChecklist)(dataCheckList);
    if (success) {
        res.status(200).json({ message });
    }
    else
        res.status(400).json({ message });
}));
exports.default = checkListRoute;
