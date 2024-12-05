import express from "express";
import {
    createUsuarioConProducto,
    getAllUsuarioConProducto,
    getUsuarioConProducto,
    deleteUsuarioConProducto,
} from "../controller/UsuarioConProductoController.js";

const router = express.Router();

/**
* @swagger
* components:
*   schemas:
*     UsuarioConProducto:
*       type: object
*       properties:
*         id_usuario:
*           type: array
*           items:
*             type: string
*             description: ID del usuario relacionado
*         id_producto:
*           type: array
*           items:
*             type: string
*             description: ID del producto relacionado
*       required:
*         - id_usuario
*         - id_producto
*       example:
*         id_usuario:
*           - "64a8f9d0b4f3f0a5cabc1234"
*         id_producto:
*           - "64a8f9d0b4f3f0a5cabc5678"
*/

/**
* @swagger
* /usuario-con-producto:
*   post:
*     summary: Crear una relación usuario-producto
*     tags: [UsuarioConProducto]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/UsuarioConProducto'
*     responses:
*       201:
*         description: Relación creada exitosamente
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/UsuarioConProducto'
*       400:
*         description: Error de validación
*/
// Crear una relación usuario-producto
router.post("/usuario-con-producto", createUsuarioConProducto);

/**
* @swagger
* /usuario-con-producto:
*   get:
*     summary: Obtener todas las relaciones usuario-producto
*     tags: [UsuarioConProducto]
*     responses:
*       200:
*         description: Lista de relaciones usuario-producto
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/UsuarioConProducto'
*       500:
*         description: Error al obtener los datos
*/
// Obtener todas las relaciones usuario-producto
router.get("/usuario-con-producto", getAllUsuarioConProducto);

/**
* @swagger
* /usuario-con-producto/{id}:
*   get:
*     summary: Obtener una relación usuario-producto por ID
*     tags: [UsuarioConProducto]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: ID de la relación
*     responses:
*       200:
*         description: Relación encontrada
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/UsuarioConProducto'
*       404:
*         description: Relación no encontrada
*       500:
*         description: Error al obtener los datos
*/
// Obtener una relación usuario-producto por ID
router.get("/usuario-con-producto/:id", getUsuarioConProducto);

/**
* @swagger
* /usuario-con-producto/{id}:
*   delete:
*     summary: Eliminar una relación usuario-producto
*     tags: [UsuarioConProducto]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: ID de la relación a eliminar
*     responses:
*       200:
*         description: Relación eliminada exitosamente
*       404:
*         description: Relación no encontrada
*       500:
*         description: Error al eliminar la relación
*/
// Eliminar una relación usuario-producto
router.delete("/usuario-con-producto/:id", deleteUsuarioConProducto);

export default router;

