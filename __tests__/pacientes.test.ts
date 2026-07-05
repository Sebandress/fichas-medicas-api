import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Pacientes API', () => {
  let token: string;

  beforeAll(async () => {
    // register and login
    await request(app).post('/auth/register').send({ username: 'test', password: 'secret' });
    const login = await request(app).post('/auth/login').send({ username: 'test', password: 'secret' });
    token = login.body.token;
  });

  it('should create and fetch a patient', async () => {
    const paciente = { nombre: 'Juan Perez', rut: '12.345.678-9' };
    const res = await request(app).post('/pacientes').set('Authorization', `Bearer ${token}`).send(paciente);
    expect(res.status).toBe(201);
    expect(res.body.rut).toBe(paciente.rut);

    const get = await request(app).get(`/pacientes/${encodeURIComponent(paciente.rut)}`);
    expect(get.status).toBe(200);
    expect(get.body.nombre).toBe(paciente.nombre);
  });

  it('should add a consulta', async () => {
    const paciente = { nombre: 'Ana', rut: '11.111.111-1' };
    const res = await request(app).post('/pacientes').set('Authorization', `Bearer ${token}`).send(paciente);
    const id = res.body._id;
    const consulta = { fecha: '2026-05-01', motivo: 'Dolor', diagnostico: 'Migraña' };
    const upd = await request(app).post(`/pacientes/${id}/consulta`).set('Authorization', `Bearer ${token}`).send(consulta);
    expect(upd.status).toBe(200);
    expect(upd.body.consultas.length).toBe(1);
  });

  it('should list pacientes by nombre query', async () => {
    const paciente = { nombre: 'María', rut: '33.333.333-3' };
    await request(app).post('/pacientes').set('Authorization', `Bearer ${token}`).send(paciente);
    const res = await request(app).get('/pacientes').query({ nombre: 'María' });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((p: any) => p.rut === paciente.rut)).toBe(true);
  });

  it('should delete a paciente', async () => {
    const paciente = { nombre: 'Pedro', rut: '44.444.444-4' };
    const res = await request(app).post('/pacientes').set('Authorization', `Bearer ${token}`).send(paciente);
    const id = res.body._id;
    const del = await request(app).delete(`/pacientes/${id}`).set('Authorization', `Bearer ${token}`);
    expect(del.status).toBe(200);
    expect(del.body.message).toBe('Paciente deleted successfully');

    const get = await request(app).get(`/pacientes/${encodeURIComponent(paciente.rut)}`);
    expect(get.status).toBe(404);
  });
});
