import express from "express";
import { 
  createRol, 
  getRol, 
  getAllRol, 
  updateRol, 
  getAllRolWithEstado, 
  deleteRol 
} from '../controller/rol_controller.js';
import { verifyJWT, verifyRole } from '../config/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Rol:
 *       type: object
 *       properties:
 *         rol:
 *           type: string
 *           description: Nombre del rol
 *           required: true
 *         estados:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID del estado relacionado
 *       required:
 *         - rol
 *       example:
 *         rol: Administrador
 *         estados:
 *           - id: 5f9b6af8f96d26f00473e566
 */

/**
 * @swagger
 * /rol:
 *   post:
 *     summary: Crea un nuevo tipo de rol
 *     tags: [rol]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rol'
 *     responses:
 *       200:
 *         description: Tipo de rol creado exitosamente
 */
router.post("/rol", verifyJWT, verifyRole(['Administrador']), createRol);

/**
 * @swagger
 * /rol:
 *   get:
 *     summary: Obtiene todos los roles
 *     tags: [rol]
 *     responses:
 *       200:
 *         description: Lista de roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rol'
 */
router.get("/rol", verifyJWT, verifyRole(['Administrador', 'Usuario']), getRol);

/**
 * @swagger
 * /rol/{id}:
 *   get:
 *     summary: Obtiene un rol específico por su ID
 *     tags: [rol]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del rol a obtener
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rol encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rol'
 *       404:
 *         description: Rol no encontrado
 */
router.get("/rol/:id", verifyJWT, verifyRole(['Administrador', 'Usuario']), getAllRol);

/**
 * @swagger
 * /rol/{id}/estado:
 *   get:
 *     summary: Obtiene los estados asociados a un rol
 *     tags: [rol]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del rol
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estados asociados al rol
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       404:
 *         description: Rol no encontrado
 */
router.get("/rol/:id/estado", verifyJWT, verifyRole(['Administrador']), getAllRolWithEstado);

/**
 * @swagger
 * /rol/{id}:
 *   put:
 *     summary: Actualiza un rol
 *     tags: [rol]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del rol a actualizar
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
 *               rol:
 *                 type: string
 *               estados:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Rol actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rol'
 *       404:
 *         description: Rol no encontrado
 */
router.put("/rol/:id", verifyJWT, verifyRole(['Administrador']), updateRol);

/**
 * @swagger
 * /rol/{id}:
 *   delete:
 *     summary: Elimina un rol
 *     tags: [rol]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del rol a eliminar
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rol eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rol eliminado exitosamente
 *       404:
 *         description: Rol no encontrado
 *       500:
 *         description: Error al eliminar el rol
 */
router.delete("/rol/:id", verifyJWT, verifyRole(['Administrador']), deleteRol);

export default router;

