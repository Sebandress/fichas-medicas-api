import { Request, Response } from 'express';
import Paciente from '../models/Paciente';
import mongoose from 'mongoose';

export async function createPaciente(req: Request, res: Response) {
  try {
    const data = req.body;
    const paciente = new Paciente(data);
    await paciente.save();
    return res.status(201).json(paciente);
  } catch (err: any) {
    if (err.code === 11000) return res.status(409).json({ error: 'RUT already exists' });
    return res.status(400).json({ error: err.message });
  }
}

export async function getPacienteByRut(req: Request, res: Response) {
  try {
    const { rut } = req.params;
    const paciente = await Paciente.findOne({ rut });
    if (!paciente) return res.status(404).json({ error: 'Paciente not found' });
    return res.json(paciente);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function addConsulta(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const consulta = req.body;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' });
    const paciente = await Paciente.findByIdAndUpdate(id, { $push: { consultas: consulta } }, { new: true });
    if (!paciente) return res.status(404).json({ error: 'Paciente not found' });
    return res.json(paciente);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function listPacientes(req: Request, res: Response) {
  try {
    const { nombre } = req.query as any;
    const filter: any = {};
    if (nombre) filter.nombre = { $regex: new RegExp(nombre, 'i') };
    const pacientes = await Paciente.find(filter).limit(50);
    return res.json(pacientes);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
