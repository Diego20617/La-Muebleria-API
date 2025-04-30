import express from "express";
import {
    createTipoProducto,
    getTipoProducto,
    getAllTipoProducto,
    updateTipoProducto,
    deleteTipoProducto,
} from "../controller/tipo_producto_controller.js";
import { verifyJWT, verifyRole } from '../config/authMiddleware.js';
const router = express.Router();

/**
* @swagger
* components:
*   schemas:
*     TipoProducto:
*       type: object
*       properties:
*         nombre:
*           type: string
*           description: Nombre del tipo de producto
*           maxLength: 50
*         descripcion:
*           type: string
*           description: Descripción del tipo de producto
*           maxLength: 200
*       required:
*         - nombre
*         - descripcion
*       example:
*         nombre: "Electrónica"
*         descripcion: "Productos electrónicos como televisores, celulares, etc."
*/

/**
* @swagger
* /tipo_producto:
*   post:
*     summary: Crear un tipo de producto
*     tags: [TipoProducto]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/TipoProducto'
*     responses:
*       201:
*         description: Tipo de producto creado exitosamente
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/TipoProducto'
*       400:
*         description: Error de validación
*/
// Crear un tipo de producto
router.post("/tipo_producto", verifyJWT, verifyRole(['Administrador']), createTipoProducto);

/**
* @swagger
* /tipo_producto:
*   get:
*     summary: Obtener todos los tipos de producto
*     tags: [TipoProducto]
*     responses:
*       200:
*         description: Lista de tipos de producto
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/TipoProducto'
*       500:
*         description: Error al obtener los datos
*/
// Obtener todos los tipos de producto
router.get("/tipo_producto", verifyJWT, verifyRole(['Administrador', 'Usuario']), getTipoProducto);

/**
* @swagger
* /tipo_producto/{id}:
*   get:
*     summary: Obtener un tipo de producto por ID
*     tags: [TipoProducto]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: ID del tipo de producto
*     responses:
*       200:
*         description: Tipo de producto encontrado
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/TipoProducto'
*       404:
*         description: Tipo de producto no encontrado
*       500:
*         description: Error al obtener el dato
*/
// Obtener un tipo de producto por ID
router.get("/tipo_producto/:id", verifyJWT, verifyRole(['Administrador', 'Usuario']), getAllTipoProducto);

/**
* @swagger
* /tipo_producto/{id}:
*   put:
*     summary: Actualizar un tipo de producto
*     tags: [TipoProducto]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: ID del tipo de producto a actualizar
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/TipoProducto'
*     responses:
*       200:
*         description: Tipo de producto actualizado exitosamente
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/TipoProducto'
*       404:
*         description: Tipo de producto no encontrado
*       400:
*         description: Error de validación
*/
// Actualizar un tipo de producto
router.put("/tipo_producto/:id", verifyJWT, verifyRole(['Administrador']), updateTipoProducto);

/**
* @swagger
* /tipo_producto/{id}:
*   delete:
*     summary: Eliminar un tipo de producto
*     tags: [TipoProducto]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: ID del tipo de producto a eliminar
*     responses:
*       200:
*         description: Tipo de producto eliminado exitosamente
*       404:
*         description: Tipo de producto no encontrado
*       500:
*         description: Error al eliminar el tipo de producto
*/
// Eliminar un tipo de producto
router.delete("/tipo_producto/:id", verifyJWT, verifyRole(['Administrador']), deleteTipoProducto);

export default router;
