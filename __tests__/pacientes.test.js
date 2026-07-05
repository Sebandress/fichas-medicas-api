"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const app_1 = __importDefault(require("../src/app"));
let mongoServer;
beforeAll(async () => {
    mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose_1.default.connect(uri);
});
afterAll(async () => {
    await mongoose_1.default.disconnect();
    await mongoServer.stop();
});
describe('Pacientes API', () => {
    let token;
    beforeAll(async () => {
        // register and login
        await (0, supertest_1.default)(app_1.default).post('/auth/register').send({ username: 'test', password: 'secret' });
        const login = await (0, supertest_1.default)(app_1.default).post('/auth/login').send({ username: 'test', password: 'secret' });
        token = login.body.token;
    });
    it('should create and fetch a patient', async () => {
        const paciente = { nombre: 'Juan Perez', rut: '12.345.678-9' };
        const res = await (0, supertest_1.default)(app_1.default).post('/pacientes').set('Authorization', `Bearer ${token}`).send(paciente);
        expect(res.status).toBe(201);
        expect(res.body.rut).toBe(paciente.rut);
        const get = await (0, supertest_1.default)(app_1.default).get(`/pacientes/${encodeURIComponent(paciente.rut)}`);
        expect(get.status).toBe(200);
        expect(get.body.nombre).toBe(paciente.nombre);
    });
    it('should add a consulta', async () => {
        const paciente = { nombre: 'Ana', rut: '11.111.111-1' };
        const res = await (0, supertest_1.default)(app_1.default).post('/pacientes').set('Authorization', `Bearer ${token}`).send(paciente);
        const id = res.body._id;
        const consulta = { fecha: '2026-05-01', motivo: 'Dolor', diagnostico: 'Migraña' };
        const upd = await (0, supertest_1.default)(app_1.default).post(`/pacientes/${id}/consulta`).set('Authorization', `Bearer ${token}`).send(consulta);
        expect(upd.status).toBe(200);
        expect(upd.body.consultas.length).toBe(1);
    });
});
