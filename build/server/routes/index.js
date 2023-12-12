"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRoutes = void 0;
const express_1 = __importDefault(require("express"));
const checklist_1 = __importDefault(require("./checklist"));
const autentication_1 = __importDefault(require("./autentication"));
const novedades_1 = __importDefault(require("./novedades"));
const apiRoutes = (app) => {
    const routes = (0, express_1.default)();
    routes.use('/auth', autentication_1.default);
    routes.use('/checklist', checklist_1.default);
    routes.use('/novedades', novedades_1.default);
    app.use('/api/v1', routes);
};
exports.apiRoutes = apiRoutes;
