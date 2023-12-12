"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketNovedades = exports.setWebSocket = void 0;
const socket_io_1 = __importDefault(require("socket.io"));
let io;
const setWebSocket = (server) => {
    io = new socket_io_1.default.Server(server);
    io.on('connect', (socket) => {
        const room = socket.handshake.query.nameRoom;
        console.log('Se ha conectado del grupo: ' + room);
        socket.join(String(room));
        socket.on('doneNovedad', (id) => {
            io.emit('doneNovedad', id);
        });
    });
};
exports.setWebSocket = setWebSocket;
const getWebSocket = () => {
    return io;
};
const socketNovedades = ({ fecha, hora, unidad, clave, origen, prioridad, destinatario }) => {
    //devuelve destinataris 
    const destinatariosSplit = destinatario === null || destinatario === void 0 ? void 0 : destinatario.split('-');
    //devuelve los destinararios sin espacios
    const destinatarios = destinatariosSplit.map(item => item.trim());
    const socketIO = getWebSocket();
    socketIO.to([...destinatarios, 'Admin']).emit('novedades', {
        fecha,
        hora,
        unidad,
        clave,
        destinatario,
        origen,
        prioridad,
    });
};
exports.socketNovedades = socketNovedades;
