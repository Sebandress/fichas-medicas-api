import mongoose, { Schema } from 'mongoose';

const ConsultaSchema = new Schema({
  fecha: { type: Date, required: true },
  motivo: { type: String },
  diagnostico: { type: String }
}, { _id: false });

const ExamenSchema = new Schema({
  tipo: { type: String },
  resultado: { type: String }
}, { _id: false });

const PacienteSchema = new Schema({
  nombre: { type: String, required: true },
  rut: { type: String, required: true, unique: true },
  alergias: { type: [String], default: [] },
  consultas: { type: [ConsultaSchema], default: [] },
  examenes: { type: [ExamenSchema], default: [] }
}, { timestamps: true });

PacienteSchema.index({ rut: 1 });
PacienteSchema.index({ nombre: 1 });

const Paciente = mongoose.model('Paciente', PacienteSchema);
export default Paciente;
