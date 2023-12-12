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
const express_1 = require("express");
const users_1 = require("../services/users");
const authToken_1 = require("../middlewares/authToken");
const authUserAdmin_1 = require("../middlewares/authUserAdmin");
const authRoute = (0, express_1.Router)();
authRoute.post('/create', authUserAdmin_1.adminAuthentication, authToken_1.tokenVerify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { usuario, clave, rol } = req.body;
        const dataSave = {
            usuario,
            clave,
            rol
        };
        const dataSaved = yield (0, users_1.createUser)(dataSave);
        if (dataSaved.success) {
            res.status(200).json({ message: dataSaved.message });
        }
        else {
            res.status(400).json({ message: dataSaved.message });
        }
    }
    catch (_a) {
        res.status(400).json({ error: 'No se han enviado los campos correspondiente en el cuerpo de la peticion' });
    }
}));
authRoute.post('/update', authUserAdmin_1.adminAuthentication, authToken_1.tokenVerify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { id, usuario, rol } = req.body;
        const clave = (_b = req.body) === null || _b === void 0 ? void 0 : _b.clave;
        const dataUpdate = {
            usuario,
            rol
        };
        const updatedData = yield (0, users_1.updateUser)(dataUpdate, { id }, clave);
        if (updatedData.success) {
            res.status(200).json({ message: updatedData.message });
        }
        else {
            res.status(400).json({ message: updatedData.message });
        }
    }
    catch (_c) {
        res.status(400).json({ error: 'No se han enviado los campos correspondiente en el cuerpo de la peticion' });
    }
}));
authRoute.post('/delete', authUserAdmin_1.adminAuthentication, authToken_1.tokenVerify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const { success, message } = yield (0, users_1.delteUser)(id);
        if (success) {
            res.status(200).json(message);
        }
        else
            res.status(400).json(message);
    }
    catch (_d) {
        res.status(400).json({ message: 'No se encontró id del usuario en la petición' });
    }
}));
authRoute.post('/list', authUserAdmin_1.adminAuthentication, authToken_1.tokenVerify, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, data, message } = yield (0, users_1.listUsers)();
    if (success)
        res.status(200).json(data);
    else
        res.status(400).json(message);
}));
authRoute.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, token, rol, message } = yield (0, users_1.userAuthentication)(req.body);
    if (success) {
        res.status(200).json({ token: token, rol: String(rol) });
    }
    else
        res.status(400).json({ error: message });
}));
exports.default = authRoute;
