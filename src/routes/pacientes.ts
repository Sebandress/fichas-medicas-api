import { Router } from 'express';
import { createPaciente, getPacienteByRut, addConsulta, listPacientes } from '../controllers/pacientesController';
import { requireAuth } from '../middleware/auth';

const router = Router();

/**
 * @openapi
 * /pacientes:
 *   get:
 *     summary: Lista pacientes (opcional query nombre)
 *     parameters:
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de pacientes
 */
router.get('/', listPacientes);

/**
 * @openapi
 * /pacientes/{rut}:
 *   get:
 *     summary: Obtener paciente por RUT
 *     parameters:
 *       - in: path
 *         name: rut
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paciente
 */
router.get('/:rut', getPacienteByRut);

/**
 * @openapi
 * /pacientes:
 *   post:
 *     summary: Crear paciente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Paciente creado
 */
router.post('/', requireAuth, createPaciente);

/**
 * @openapi
 * /pacientes/{id}/consulta:
 *   post:
 *     summary: Agregar consulta a paciente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Paciente actualizado
 */
router.post('/:id/consulta', requireAuth, addConsulta);

export default router;
