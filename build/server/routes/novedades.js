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
const express_1 = require("express");
const authUserAdmin_1 = require("../middlewares/authUserAdmin");
const objectToSql_1 = require("../utils/objectToSql");
const webSocket_1 = require("../../webSocket");
const novedades_1 = require("../services/novedades");
const date_1 = require("../utils/date");
const authToken_1 = require("../middlewares/authToken");
const api_1 = __importDefault(require("../logs/api"));
const novRoutes = (0, express_1.Router)();
// Ruta para dar por terminada la gestión de la novedad
novRoutes.post('/done/:id', authUserAdmin_1.rolAuthentication, authToken_1.tokenVerify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { dateToday, now } = (0, date_1.today)();
    const { observacion, username } = req.body;
    const where = {
        id: req.params.id
    };
    const dataUpdate = {
        gestion: 'Si',
        fecha_gestion: (0, date_1.dateConvert)(dateToday),
        hora_gestion: now,
        observacion,
        usuario_gestion: username
    };
    const { success, message } = yield (0, novedades_1.updateNovedad)(dataUpdate, where);
    if (success) {
        res.status(200).json(message).end();
    }
    else
        res.status(400).json(message).end();
}));
//listar novedades filtradas
novRoutes.post('/filter', authUserAdmin_1.rolAuthentication, authToken_1.tokenVerify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { columns, where } = req.body;
    const { success, data, message } = yield (0, novedades_1.listNovedad)(columns, where);
    if (success) {
        res.status(200).json(data === null || data === void 0 ? void 0 : data.recordset);
    }
    else
        res.status(400).json({ message: 'No se pudo realizar el filtro: ' + message }).end();
}));
/* Filtra  donde gestión sea igual a Si y donde fecha sega igual al dia actual*/
novRoutes.post('/historico', authUserAdmin_1.rolAuthentication, authToken_1.tokenVerify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let destinatario = (_a = req.body) === null || _a === void 0 ? void 0 : _a.destinatario;
    const { dateToday } = (0, date_1.today)();
    const fecha_gestion = (0, date_1.dateConvert)(dateToday);
    const gestion = 'Si';
    const columns = [
        'id',
        'fecha',
        'hora',
        'unidad',
        'clave',
        'prioridad',
        'gestion',
        'fecha_gestion',
        'hora_gestion',
        'descripcion',
        'observacion'
    ];
    //se le pasa para que filtre la información donde el destinatario contenga el nombre del destinatario 
    destinatario = {
        contains: destinatario
    };
    const where = destinatario.contains !== 'Admin' ? { gestion, destinatario, fecha_gestion } : { gestion, fecha_gestion };
    const { success, data, message } = yield (0, novedades_1.listNovedadOrderBy)(columns, where, ['fecha_gestion', 'hora'], ['DESC', 'DESC']);
    if (success) {
        res.status(200).json(data === null || data === void 0 ? void 0 : data.recordset);
    }
    else
        res.status(400).json({ message });
}));
novRoutes.post('/historicoFilter', authUserAdmin_1.rolAuthentication, authToken_1.tokenVerify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { fechaInicial, fechaFinal, unidad, destinatario, prioridad, gestion, origen } = req.body;
    const columns = [
        'id',
        'fecha',
        'hora',
        'unidad',
        'clave',
        'prioridad',
        'gestion',
        'fecha_gestion',
        'hora_gestion',
        'descripcion',
        'observacion'
    ];
    const between = fechaFinal && fechaFinal ? (0, objectToSql_1.objectToBetween)('fecha', fechaInicial, fechaFinal) : '';
    let dataSend = {};
    //se le pasa para que filtre la información donde el destinatario contenga el nombre del destinatario 
    destinatario = {
        contains: destinatario
    };
    dataSend = unidad ? Object.assign(Object.assign({}, dataSend), { unidad }) : dataSend;
    dataSend = destinatario.contains ? Object.assign(Object.assign({}, dataSend), { destinatario }) : dataSend;
    dataSend = prioridad ? Object.assign(Object.assign({}, dataSend), { prioridad }) : dataSend;
    dataSend = gestion ? Object.assign(Object.assign({}, dataSend), { gestion }) : dataSend;
    dataSend = origen ? Object.assign(Object.assign({}, dataSend), { origen }) : dataSend;
    const where = Object.assign({}, dataSend);
    const { success, data, message } = yield (0, novedades_1.listNovedadOrderBy)(columns, where, ['fecha', 'hora'], ['DESC', 'DESC'], between);
    if (success) {
        res.status(200).json(data === null || data === void 0 ? void 0 : data.recordset);
    }
    else
        res.status(400).json({ message });
}));
//listar novedades filtradas
novRoutes.post('/prioridad', authUserAdmin_1.rolAuthentication, authToken_1.tokenVerify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { prioridad, destinatario } = req.body;
    const columns = ['id', 'fecha', 'hora', 'unidad', 'clave', 'prioridad', 'descripcion', 'gestion', 'origen'];
    let where = {
        prioridad,
        gestion: 'No',
    };
    destinatario = {
        contains: destinatario
    };
    if (destinatario.contains !== 'Admin') {
        where = Object.assign(Object.assign({}, where), { destinatario });
    }
    const { success, data, message } = yield (0, novedades_1.listNovedadOrderBy)(columns, where, ['fecha', 'hora'], ['DESC', 'DESC']);
    if (success) {
        const dataFilter = data === null || data === void 0 ? void 0 : data.recordset.filter(item => (item === null || item === void 0 ? void 0 : item.origen) !== 'CHECKLIST');
        console.log(dataFilter);
        res.status(200).json(dataFilter);
    }
    else
        res.status(400).json({ message });
}));
// transmite la información por WebSocket
novRoutes.post('/transmitir', authUserAdmin_1.rolAuthentication, authToken_1.tokenVerify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { baseUrl } = req;
    const { fecha, hora, unidad, clave, origen, prioridad, descripcion, destinatario } = req.body;
    const { dateToday, now } = (0, date_1.today)();
    const isBodyValid = Object.keys(req.body).length !== 0;
    if (isBodyValid) {
        let dataMessage = {
            fecha: (0, date_1.dateConvert)(fecha),
            hora,
            unidad: Number(unidad),
            clave,
            origen,
            prioridad: Number(prioridad),
            fecha_entrega: (0, date_1.dateConvert)(dateToday),
            hora_entrega: now,
            gestion: 'No',
            descripcion,
            destinatario,
        };
        if (origen == 'CHECKLIST') {
            dataMessage = Object.assign(Object.assign({}, dataMessage), { fecha_gestion: (0, date_1.dateConvert)(dateToday), hora_gestion: hora, gestion: 'Si' });
        }
        const { success, message } = yield (0, novedades_1.createNovedad)(dataMessage);
        if (success) {
            const { origen } = dataMessage;
            //si origen es diferente a checkList lo transmite
            origen !== 'CHECKLIST' && (0, webSocket_1.socketNovedades)(dataMessage);
            res.status(200).json({ message: 'Se ha guardado y transmitido la información con exito.' });
        }
        else {
            (0, api_1.default)(baseUrl, message, dataMessage);
            res.status(400).json({ message: 'No se ha podido transmitir la novedad. Error: ' + message });
        }
    }
    else
        res.status(400).json({ message: 'No se ha encontrado datos en la peticion ' });
}));
exports.default = novRoutes;
