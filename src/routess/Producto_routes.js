import express from "express";
import {
    createProducto,
    getProducto,
    getAllProducto,
    getAllProductoWithTipProducto,
    updateProducto,
    deleteProducto,
} from "../controller/Producto_controller.js";

import { validatorHandler } from "../middleware/validator.handler.js";
import {
    createProductoSchema,
    getProductoSchema,
    updateProductoSchema,
    deleteProductoSchema,
} from "../validators/ProductoValidatorDTO.js";

import { verifyJWT, verifyRole } from '../config/authMiddleware.js';
const router = express.Router();

/**
* @swagger
* components:
*   schemas:
*     Producto:
*       type: object
*       properties:
*         nombre:
*           type: string
*           description: Nombre del producto
*           maxLength: 100
*         precio:
*           type: number
*           description: Precio del producto
*           minimum: 0
*         descripcion:
*           type: string
*           description: Descripción del producto (opcional)
*           maxLength: 500
*         tipo_producto_id:
*           type: string
*           description: ID del tipo de producto asociado
*       required:
*         - nombre
*         - precio
*         - tipo_producto_id
*       example:
*         nombre: "Mesa de comedor"
*         precio: 150.75
*         descripcion: "Mesa de madera con capacidad para 6 personas"
*         tipo_producto_id: "63f2bf7c9a1b0c0012d7e2c4"
*/

/**
* @swagger
* /producto:
*   post:
*     summary: Crear un nuevo producto
*     tags: [Producto]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Producto'
*     responses:
*       201:
*         description: Producto creado exitosamente
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Producto'
*       400:
*         description: Error de validación
*/
// Ruta para crear un producto
router.post(
    "/producto", verifyJWT, verifyRole(['Administrador']),
    validatorHandler(createProductoSchema, "body"),
    createProducto
);

/**
* @swagger
* /producto:
*   get:
*     summary: Obtener todos los productos
*     tags: [Producto]
*     responses:
*       200:
*         description: Lista de productos
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Producto'
*       500:
*         description: Error al obtener los productos
*/
// Ruta para obtener todos los productos
router.get("/producto", verifyJWT, verifyRole(['Administrador', 'Usuario']), getProducto);

/**
* @swagger
* /producto/{id}:
*   get:
*     summary: Obtener un producto por ID
*     tags: [Producto]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: ID del producto
*     responses:
*       200:
*         description: Producto encontrado
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Producto'
*       404:
*         description: Producto no encontrado
*       500:
*         description: Error al obtener el producto
*/
// Ruta para obtener un producto por ID
router.get(
    "/producto/:id", verifyJWT, verifyRole(['Administrador', 'Usuario']),
    validatorHandler(getProductoSchema, "params"),
    getAllProducto
);

/**
* @swagger
* /producto/withTipoProducto/{id}:
*   get:
*     summary: Obtener un producto por ID con su tipo de producto asociado
*     tags: [Producto]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: ID del producto
*     responses:
*       200:
*         description: Producto con tipo de producto encontrado
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Producto'
*       404:
*         description: Producto no encontrado
*       500:
*         description: Error al obtener el producto
*/
// Ruta para obtener un producto por ID con su tipo de producto
router.get(
    "/producto/withTipoProducto/:id", verifyJWT, verifyRole(['Administrador', 'Usuario']),
    validatorHandler(getProductoSchema, "params"),
    getAllProductoWithTipProducto
);

/**
* @swagger
* /producto/{id}:
*   put:
*     summary: Actualizar un producto por ID
*     tags: [Producto]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: ID del producto
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Producto'
*     responses:
*       200:
*         description: Producto actualizado exitosamente
*       400:
*         description: Error de validación
*       404:
*         description: Producto no encontrado
*       500:
*         description: Error al actualizar el producto
*/
// Ruta para actualizar un producto por ID
router.put(
    "/producto/:id", verifyJWT, verifyRole(['Administrador']),
    validatorHandler(getProductoSchema, "params"),
    validatorHandler(updateProductoSchema, "body"),
    updateProducto
);

/**
* @swagger
* /producto/{id}:
*   delete:
*     summary: Eliminar un producto por ID
*     tags: [Producto]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: ID del producto a eliminar
*     responses:
*       200:
*         description: Producto eliminado exitosamente
*       404:
*         description: Producto no encontrado
*       500:
*         description: Error al eliminar el producto
*/
// Ruta para eliminar un producto por ID
router.delete(
    "/producto/:id", verifyJWT, verifyRole(['Administrador']),
    validatorHandler(deleteProductoSchema, "params"),
    deleteProducto
);

export default router;

