import express from "express";
import {
    createMaterial,
    getAllMaterials,
    getMaterial,
    deleteMaterial,
} from "../controller/MaterialController.js";
import { verifyJWT, verifyRole } from '../config/authMiddleware.js';

const router = express.Router();

/**
* @swagger
* components:
*   schemas:
*     Material:
*       type: object
*       properties:
*         material:
*           type: string
*           description: Nombre del material
*           maxLength: 45
*       required:
*         - material
*       example:
*         material: "Madera de pino"
*/

/**
* @swagger
* /material:
*   post:
*     summary: Crear un nuevo material
*     tags: [Material]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Material'
*     responses:
*       201:
*         description: Material creado exitosamente
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Material'
*       400:
*         description: Error de validación
*/
// Ruta para crear un material
router.post("/material", verifyJWT, verifyRole(['Administrador']), createMaterial);

/**
* @swagger
* /material:
*   get:
*     summary: Obtener todos los materiales
*     tags: [Material]
*     responses:
*       200:
*         description: Lista de materiales
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Material'
*       500:
*         description: Error al obtener los materiales
*/
// Ruta para obtener todos los materiales
router.get("/material", verifyJWT, verifyRole(['Administrador', 'Usuario']), getAllMaterials);

/**
* @swagger
* /material/{id}:
*   get:
*     summary: Obtener un material por ID
*     tags: [Material]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: ID del material
*     responses:
*       200:
*         description: Material encontrado
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Material'
*       404:
*         description: Material no encontrado
*       500:
*         description: Error al obtener el material
*/
// Ruta para obtener un material por ID
router.get("/material/:id", verifyJWT, verifyRole(['Administrador', 'Usuario']), getMaterial);

/**
* @swagger
* /material/{id}:
*   delete:
*     summary: Eliminar un material por ID
*     tags: [Material]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: ID del material a eliminar
*     responses:
*       200:
*         description: Material eliminado exitosamente
*       404:
*         description: Material no encontrado
*       500:
*         description: Error al eliminar el material
*/
// Ruta para eliminar un material por ID
router.delete("/material/:id", verifyJWT, verifyRole(['Administrador']), deleteMaterial);

export default router;
