import express from "express";
import { 
  deleteEstado, 
  updateEstado, 
  getAllEstado, 
  getEstado, 
  createEstado 
} from '../controller/estado_controller.js';
import { verifyJWT, verifyRole } from '../config/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     estado:
 *       type: object
 *       properties:
 *         estado:
 *           type: string
 *           description: Tipo de estado del rol
 *       required:
 *         - estado
 *       example:
 *         estado: Activo
 */

/**
 * @swagger
 * /estado:
 *   post:
 *     summary: Crea un nuevo tipo de estado
 *     tags: [estado]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/estado'
 *     responses:
 *       200:
 *         description: Tipo de estado creado exitosamente
 */
router.post("/estado", verifyJWT, verifyRole(['Administrador']), createEstado);

/**
 * @swagger
 * /estado:
 *   get:
 *     summary: Retorna los registros de los estados
 *     tags: [estado]
 *     responses:
 *       200:
 *         description: Esta es la lista de los tipos de estados registrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/estado'
 */
router.get("/estado", verifyJWT, verifyRole(['Administrador', 'Usuario']), getEstado);

/**
 * @swagger
 * /estado/{id}:
 *   get:
 *     summary: Obtiene un estado por su ID
 *     tags: [estado]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del estado a consultar
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estado encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/estado'
 *       404:
 *         description: Estado no encontrado
 */
router.get("/estado/:id", verifyJWT, verifyRole(['Administrador', 'Usuario']), getAllEstado);

/**
 * @swagger
 * /estado/{id}:
 *   put:
 *     summary: Actualizar un estado
 *     tags: [estado]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del estado a actualizar
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
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Estado actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/estado'
 *       404:
 *         description: Estado no encontrado
 */
router.put("/estado/:id", verifyJWT, verifyRole(['Administrador']), updateEstado);

/**
 * @swagger
 * /estado/{id}:
 *   delete:
 *     summary: Elimina un tipo de estado
 *     tags: [estado]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del tipo de estado a eliminar
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tipo de estado eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tipo de estado eliminado exitosamente
 *       404:
 *         description: Tipo de estado no encontrado
 *       500:
 *         description: Error al eliminar el tipo de estado
 */
router.delete("/estado/:id", verifyJWT, verifyRole(['Administrador']), deleteEstado);

export default router;