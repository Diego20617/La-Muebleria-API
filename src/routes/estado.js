import express from "express";
import { deleteEstado, updateEstado, getAllEstado, getEstado, createEstado } from '../controller/estado_controller.js'

const router = express.Router();


/**
 * @swagger
/estado:
  post:
    summary: Crea un nuevo tipo de estado
    tags: [estado]
    requestBody:
      required: true
      content:
        application/json:
          schema:
          type: object
            $ref: '#/components/schemas/estado'
    responses:
      200:
        description: Tipo de estado creado exitosamente
 */
//Creamos el ler endpoint
router.post("/estado", createEstado);


/**
 * @swagger
/estado:
  get:
    summary: Retorna los registros de los estados
    tags: [estado]
    responses:
      200:
        description: Esta es la lista de los tipos de estados registrados
        content:
          application/json:
            schema:
            type: array
            items:
            $ref: '#/components/schemas/estado'
 */
//2.Creamos la ruta para obtener todos los documentos de mi bdd en la colection estado
router.get("/estado", getEstado);

// 3.Creamos la ruta para consultar un documento de mi bdd en la coleccion estado
router.get("/estado/:id", getAllEstado);



/**
 * @swagger
 * /estado/{id}:
 *   put:
 *     summary: Actualizar un estado
 *     tags: [estado]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del estado a actualizar
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
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Estado actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/estado'
 *       404:
 *         description: Estado no encontrado
 */
// 4.Creamos la ruta para actualizar un documento en la coleccion estado
router.put("/estado/:id", updateEstado);

/**
 * @swagger
 /estado/{id}:
  delete:
    summary: Elimina un tipo de estado
    tags: [estado]
    parameters:
      - in: path
        name: id
        description: ID del tipo de estado a eliminar
        required: true
        schema:
          type: string
    responses:
      200:
        description: Tipo de estado eliminado exitosamente
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: Tipo de estado eliminado exitosamente
      404:
        description: Tipo de documento no encontrado
      500:
        description: Error al eliminar el tipo de documento
 */
// 5.Creamos la ruta para borrar un documento de mi bdd en la coleccion estado
router.delete("/estado/:id", deleteEstado);

export default router;