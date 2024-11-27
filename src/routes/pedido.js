import express from "express";
import { createPedido, getPedido, getAllPedido, updatePedido, getAllPedidodWithDireccion, deletePedido} from '../controller/pedido_controller.js'

const router = express.Router(); 


/**
 * @swagger
/pedido:
  post:
    summary: Crea un nuevo tipo de pedido
    tags: [pedido]
    requestBody:
      required: true
      content:
        application/json:
          schema:
          type: object
            $ref: '#/components/schemas/pedido'
    responses:
      200:
        description: Pedido creado exitosamente
 */
//Creamos el ler endpoint
router.post("/pedido", createPedido);


/**
 * @swagger
 * /pedido:
 *   get:
 *     summary: Obtiene todos los pedidos
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/pedido'
 */
//2.Creamos la ruta para obtener todos los documentos de mi bdd en la colection tip_doc
router.get("/pedido", getPedido);

// 3.Creamos la ruta para consultar un documento de mi bdd en la coleccion tip_doc
router.get("/pedido/:id", getAllPedido);

router.get("/pedido/:id/direccion", getAllPedidodWithDireccion);


/**
 * @swagger
 * /pedido/{id}:
 *   put:
 *     summary: Actualizar un pedido
 *     tags: [pedido]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del pedido a actualizar
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties: 1 
 *               cant_productos:
 *                 type: string
 *               id_direccion:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Pedido actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/pedido'
 *       404:
 *         description: Pedido no encontrado
 */
// 4.Creamos la ruta para actualizar un documento en la coleccion tip_doc
router.put("/pedido/:id", updatePedido);


/** 
 * @swagger
/pedido/{id}:
  delete:
    summary: Elimina un pedido
    tags: [pedido]
    parameters:
      - in: path
        name: id
        description: ID del pedido a eliminar
        required: true
        schema:
          type: string
    responses:
      200:
        description: pedido eliminado exitosamente
      404:
        description: pedido no encontrado
      500:
        description: Error al eliminar el pedido
*/
// 5.Creamos la ruta para borrar un documento de mi bdd en la coleccion tip_doc
router.delete("/pedido/:id", deletePedido);

export default router;
