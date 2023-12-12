"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = require("./server/routes");
const webSocket_1 = require("./webSocket");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 3000;
const corsOptions = {
    origin: "*"
};
// Middlewares iniciales
app.use((0, morgan_1.default)('dev'));
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json({ limit: '1000mb' }));
app.use(express_1.default.static('public'));
//Rutas del servidor
(0, routes_1.apiRoutes)(app);
//ruta de documentación
app.get('/doc', (req, res) => {
    res.sendFile(__dirname + '/server/statics/doc.html');
});
// Ruta no encontrada 404
app.use((_req, res) => {
    res.status(404).json('Esta ruta no existe');
});
const server = app.listen(PORT, () => console.log(`Servidor corriendo en el puerto: ${PORT}.`));
// asigna el socket
(0, webSocket_1.setWebSocket)(server);
