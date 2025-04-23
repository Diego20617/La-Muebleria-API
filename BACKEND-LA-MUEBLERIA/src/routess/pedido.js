import express from "express";
import { 
  createPedido, 
  getPedido, 
  getAllPedido, 
  updatePedido, 
  getAllPedidodWithDireccion, 
  deletePedido 
} from '../controller/pedido_controller.js';
import { verifyJWT, verifyRole } from '../config/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Pedido:
 *       type: object
 *       properties:
 *         cant_productos:
 *           type: integer
 *           description: Cantidad de productos en el pedido
 *         id_direccion:
 *           type: array
 *           items:
 *             type: string
 *             description: ID de la dirección relacionada
 *       required:
 *         - cant_productos
 *         - id_direccion
 *       example:
 *         cant_productos: 5
 *         id_direccion:
 *           - "5f9b6af8f96d26f00473e566"
 */

/**
 * @swagger
 * /pedido:
 *   post:
 *     summary: Crea un nuevo pedido
 *     tags: [pedido]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pedido'
 *     responses:
 *       200:
 *         description: Pedido creado exitosamente
 */
router.post("/pedido", verifyJWT, verifyRole(['Administrador', 'Usuario']), createPedido);

/**
 * @swagger
 * /pedido:
 *   get:
 *     summary: Obtiene todos los pedidos
 *     tags: [pedido]
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 */
router.get("/pedido", verifyJWT, verifyRole(['Administrador']), getPedido);

/**
 * @swagger
 * /pedido/{id}:
 *   get:
 *     summary: Obtiene un pedido por su ID
 *     tags: [pedido]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del pedido a consultar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       404:
 *         description: Pedido no encontrado
 */
router.get("/pedido/:id", verifyJWT, verifyRole(['Administrador', 'Usuario']), getAllPedido);

/**
 * @swagger
 * /pedido/{id}/direccion:
 *   get:
 *     summary: Obtiene un pedido con su dirección relacionada
 *     tags: [pedido]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del pedido
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido con dirección encontrado
 */
router.get("/pedido/:id/direccion", verifyJWT, verifyRole(['Administrador', 'Usuario']), getAllPedidodWithDireccion);

/**
 * @swagger
 * /pedido/{id}:
 *   put:
 *     summary: Actualizar un pedido
 *     tags: [pedido]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del pedido a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cant_productos:
 *                 type: integer
 *                 description: Nueva cantidad de productos
 *               id_direccion:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: ID de la dirección relacionada
 *     responses:
 *       200:
 *         description: Pedido actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       404:
 *         description: Pedido no encontrado
 */
router.put("/pedido/:id", verifyJWT, verifyRole(['Administrador']), updatePedido);

/**
 * @swagger
 * /pedido/{id}:
 *   delete:
 *     summary: Elimina un pedido
 *     tags: [pedido]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del pedido a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido eliminado exitosamente
 *       404:
 *         description: Pedido no encontrado
 *       500:
 *         description: Error al eliminar el pedido
 */
router.delete("/pedido/:id", verifyJWT, verifyRole(['Administrador']), deletePedido);

export default router;
