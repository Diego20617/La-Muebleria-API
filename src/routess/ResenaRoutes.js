import express from "express";
import {
    createResena,
    getAllResena,
    getResena,
    deleteResena,
} from "../controller/ResenaController.js";

const router = express.Router();

/**
* @swagger
* components:
*   schemas:
*     Resena:
*       type: object
*       properties:
*         resena:
*           type: string
*           description: Texto de la reseña
*           maxLength: 45
*         id_producto:
*           type: string
*           description: ID del producto asociado a la reseña
*       required:
*         - resena
*         - id_producto
*       example:
*         resena: "Producto de excelente calidad"
*         id_producto: "63f2bf7c9a1b0c0012d7e2c4"
*/

/**
* @swagger
* /resena:
*   post:
*     summary: Crear una nueva reseña
*     tags: [Resena]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Resena'
*     responses:
*       201:
*         description: Reseña creada exitosamente
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Resena'
*       400:
*         description: Error de validación
*/
// Crear una reseña
router.post("/resena", createResena);

/**
* @swagger
* /resena:
*   get:
*     summary: Obtener todas las reseñas
*     tags: [Resena]
*     responses:
*       200:
*         description: Lista de reseñas
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Resena'
*       500:
*         description: Error al obtener las reseñas
*/
// Obtener todas las reseñas
router.get("/resena", getAllResena);

/**
* @swagger
* /resena/{id}:
*   get:
*     summary: Obtener una reseña por ID
*     tags: [Resena]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: ID de la reseña
*     responses:
*       200:
*         description: Reseña encontrada
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Resena'
*       404:
*         description: Reseña no encontrada
*       500:
*         description: Error al obtener la reseña
*/
// Obtener una reseña por ID
router.get("/resena/:id", getResena);

/**
* @swagger
* /resena/{id}:
*   delete:
*     summary: Eliminar una reseña
*     tags: [Resena]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: ID de la reseña a eliminar
*     responses:
*       200:
*         description: Reseña eliminada exitosamente
*       404:
*         description: Reseña no encontrada
*       500:
*         description: Error al eliminar la reseña
*/
// Eliminar una reseña
router.delete("/resena/:id", deleteResena);

export default router;

