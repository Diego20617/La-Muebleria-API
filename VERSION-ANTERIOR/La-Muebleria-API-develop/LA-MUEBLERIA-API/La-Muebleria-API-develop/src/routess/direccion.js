import express from "express";
import { 
  createDireccion, 
  getDireccion, 
  getAllDireccion, 
  updateDireccion, 
  deleteDireccion 
} from '../controller/direccion_controller.js';
import { verifyJWT, verifyRole } from '../config/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Direccion:
 *       type: object
 *       properties:
 *         direccion:
 *           type: string
 *           description: Dirección
 *       required:
 *         - direccion
 *       example:
 *         direccion: Calle Falsa 123
 */

/**
 * @swagger
 * /direccion:
 *   post:
 *     summary: Crea una nueva dirección
 *     tags: [direccion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Direccion'
 *     responses:
 *       200:
 *         description: Dirección creada exitosamente
 */
router.post("/direccion", verifyJWT, verifyRole(['Administrador']), createDireccion);

/**
 * @swagger
 * /direccion:
 *   get:
 *     summary: Obtiene todas las direcciones
 *     tags: [direccion]
 *     responses:
 *       200:
 *         description: Lista de direcciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Direccion'
 */
router.get("/direccion", verifyJWT, verifyRole(['Administrador', 'Usuario']), getDireccion);

/**
 * @swagger
 * /direccion/{id}:
 *   get:
 *     summary: Obtiene una dirección por su ID
 *     tags: [direccion]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de la dirección a consultar
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dirección encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Direccion'
 *       404:
 *         description: Dirección no encontrada
 */
router.get("/direccion/:id", verifyJWT, verifyRole(['Administrador', 'Usuario']), getAllDireccion);

/**
 * @swagger
 * /direccion/{id}:
 *   put:
 *     summary: Actualizar una dirección
 *     tags: [direccion]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de la dirección a actualizar
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Direccion'
 *     responses:
 *       200:
 *         description: Dirección actualizada exitosamente
 *       404:
 *         description: Dirección no encontrada
 */
router.put("/direccion/:id", verifyJWT, verifyRole(['Administrador']), updateDireccion);

/**
 * @swagger
 * /direccion/{id}:
 *   delete:
 *     summary: Elimina una dirección
 *     tags: [direccion]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de la dirección a eliminar
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dirección eliminada exitosamente
 *       404:
 *         description: Dirección no encontrada
 *       500:
 *         description: Error al eliminar la dirección
 */
router.delete("/direccion/:id", verifyJWT, verifyRole(['Administrador']), deleteDireccion);

export default router;
