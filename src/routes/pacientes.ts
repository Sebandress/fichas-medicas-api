import { Router } from 'express';
import { createPaciente, getPacienteByRut, addConsulta, listPacientes, deletePaciente } from '../controllers/pacientesController';
import { requireAuth, requireRole } from '../middleware/auth';

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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/:rut', getPacienteByRut);

/**
 * @openapi
 * /pacientes:
 *   post:
 *     summary: Crear paciente
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               rut:
 *                 type: string
 *               edad:
 *                 type: integer
 *               direccion:
 *                 type: string
 *             required:
 *               - nombre
 *               - rut
 *     responses:
 *       201:
 *         description: Paciente creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.post('/', requireAuth, createPaciente);

/**
 * @openapi
 * /pacientes/{id}/consulta:
 *   post:
 *     summary: Agregar consulta a paciente
 *     security:
 *       - bearerAuth: []
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
 *             properties:
 *               fecha:
 *                 type: string
 *                 format: date
 *               motivo:
 *                 type: string
 *               diagnostico:
 *                 type: string
 *             required:
 *               - fecha
 *               - motivo
 *               - diagnostico
 *     responses:
 *       200:
 *         description: Paciente actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.post('/:id/consulta', requireAuth, addConsulta);

/**
 * @openapi
 * /pacientes/{id}:
 *   delete:
 *     summary: Eliminar paciente por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paciente eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Paciente no encontrado
 */
router.delete('/:id', requireAuth, requireRole('admin'), deletePaciente);

export default router;
