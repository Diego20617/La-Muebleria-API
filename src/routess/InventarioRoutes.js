import express from "express";
import {
    createInventario,
    getAllInventarios,
    getInventario,
    deleteInventario,
} from "../controller/InventarioController.js";

const router = express.Router();

/**
* @swagger
* components:
*   schemas:
*     Inventario:
*       type: object
*       properties:
*         cantidad:
*           type: string
*           description: Cantidad del producto en inventario
*           maxLength: 45
*         id_producto:
*           type: string
*           description: ID del producto relacionado
*         id_material:
*           type: string
*           description: ID del material relacionado
*       required:
*         - cantidad
*         - id_producto
*         - id_material
*       example:
*         cantidad: "100"
*         id_producto: "60d21b4667d0d8992e610c85"
*         id_material: "60d21b4667d0d8992e610c86"
*/

/**
* @swagger
* /inventario:
*   post:
*     summary: Crear un nuevo registro de inventario
*     tags: [Inventario]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Inventario'
*     responses:
*       201:
*         description: Inventario creado exitosamente
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Inventario'
*       400:
*         description: Error de validación
*/
// Ruta para crear un registro de inventario
router.post("/inventario", createInventario);

/**
* @swagger
* /inventario:
*   get:
*     summary: Obtener todos los registros de inventario
*     tags: [Inventario]
*     responses:
*       200:
*         description: Lista de inventarios
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Inventario'
*       500:
*         description: Error al obtener los registros de inventario
*/
// Ruta para obtener todos los registros de inventario
router.get("/inventario", getAllInventarios);

/**
* @swagger
* /inventario/{id}:
*   get:
*     summary: Obtener un registro de inventario por ID
*     tags: [Inventario]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: ID del inventario a obtener
*     responses:
*       200:
*         description: Registro de inventario encontrado
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Inventario'
*       404:
*         description: Inventario no encontrado
*       500:
*         description: Error al obtener el registro de inventario
*/
// Ruta para obtener un registro de inventario por ID
router.get("/inventario/:id", getInventario);

/**
* @swagger
* /inventario/{id}:
*   delete:
*     summary: Eliminar un registro de inventario por ID
*     tags: [Inventario]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: ID del inventario a eliminar
*     responses:
*       200:
*         description: Registro de inventario eliminado exitosamente
*       404:
*         description: Inventario no encontrado
*       500:
*         description: Error al eliminar el registro de inventario
*/
// Ruta para eliminar un registro de inventario por ID
router.delete("/inventario/:id", deleteInventario);

export default router;

