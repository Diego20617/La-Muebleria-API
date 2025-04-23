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

// import { verifyJWT, verifyRole } from '../config/authMiddleware.js';
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Producto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre del producto
 *           maxLength: 100
 *         category:
 *           type: string
 *           description: Categoria del producto
 *         price:
 *           type: string
 *           description: Precio del producto
 *         stock:
 *           type: string
 *           description: Stock del producto
 *         description:
 *           type: string
 *           description: Descripcion del producto
 *         color:
 *           type: string
 *           description: Color del producto
 *         dimensions:
 *           type: object
 *           properties:
 *             height:
 *               type: string
 *               description: Alto (cm)
 *             width:
 *               type: string
 *               description: Ancho (cm)
 *             depth:
 *               type: string
 *               description: Profundidad (cm)
 *           description: Dimensiones del producto
 *         imageUrl:
 *           type: string
 *           description: URL de la imagen del producto
 *         tipo_producto_id:
 *           type: string
 *           description: ID del tipo de producto relacionado
 *       required:
 *         - name
 *         - price
 *         - description
 *       example:
 *         name: "Mesa de comedor"
 *         category: "Muebles"
 *         price: "150.75"
 *         stock: "50"
 *         description: "Mesa de madera con capacidad para 6 personas"
 *         color: "Marrón"
 *         dimensions:
 *           height: "180"
 *           width: "80"
 *           depth: "50"
 *         imageUrl: "https://ejemplo.com/imagen.jpg"
 *         tipo_producto_id: "63f2bf7c9a1b0c0012d7e2c4"
 */

/**
 * @swagger
 * /producto:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Producto]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos para realizar esta acción
 */
// Ruta para crear un producto
router.post(
    "/producto", 
    validatorHandler(createProductoSchema, "body"),
    createProducto
);

/**
 * @swagger
 * /producto:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Producto]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos para realizar esta acción
 *       500:
 *         description: Error al obtener los productos
 */
// Ruta para obtener todos los productos
router.get("/producto", getProducto);

/**
 * @swagger
 * /producto/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Producto]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos para realizar esta acción
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al obtener el producto
 */
// Ruta para obtener un producto por ID
router.get(
    "/producto/:id",
    validatorHandler(getProductoSchema, "params"),
    getAllProducto
);

/**
 * @swagger
 * /producto/withTipoProducto/{id}:
 *   get:
 *     summary: Obtener un producto por ID con su tipo de producto asociado
 *     tags: [Producto]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos para realizar esta acción
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al obtener el producto
 */
// Ruta para obtener un producto por ID con su tipo de producto
router.get(
    "/producto/withTipoProducto/:id", 
    validatorHandler(getProductoSchema, "params"),
    getAllProductoWithTipProducto
);

/**
 * @swagger
 * /producto/{id}:
 *   put:
 *     summary: Actualizar un producto por ID
 *     tags: [Producto]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos para realizar esta acción
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al actualizar el producto
 */
// Ruta para actualizar un producto por ID
router.put(
    "/producto/:id", 
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
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos para realizar esta acción
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al eliminar el producto
 */
// Ruta para eliminar un producto por ID
router.delete(
    "/producto/:id", 
    validatorHandler(deleteProductoSchema, "params"),
    deleteProducto
);

export default router;

