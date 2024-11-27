import express from "express";
import { createTipDoc, getTipDoc, getAllTipDoc, updateTipDoc, getAllTipDocWithUsuarios, deleteTipDoc} from '../controller/tip_doc_controller.js'

const router = express.Router(); 


/**
 * @swagger
/tip_doc:
  post:
    summary: Crea un nuevo tipo de documento
    tags: [tip_doc]
    requestBody:
      required: true
      content:
        application/json:
          schema:
          type: object
            $ref: '#/components/schemas/tip_doc'
    responses:
      200:
        description: Tipo de documento creado exitosamente
 */
//Creamos el ler endpoint
router.post("/tip_doc", createTipDoc);


/**
 * @swagger
/tip_doc:
  get:
    summary: Retorna los registros de los tipos de documentos
    tags: [tip_doc]
    responses:
      200:
        description: Esta es la lista de los tipos de documentos registrados
        content:
          application/json:
            schema:
            type: array
            items:
            $ref: '#/components/schemas/tip_doc'
 */
//2.Creamos la ruta para obtener todos los documentos de mi bdd en la colection tip_doc
router.get("/tip_doc", getTipDoc);

// 3.Creamos la ruta para consultar un documento de mi bdd en la coleccion tip_doc
router.get("/tip_doc/:id", getAllTipDoc);

router.get("/tip_doc/:id/usuario", getAllTipDocWithUsuarios);


/**
 * @swagger
 * /tip_doc/{id}:
 *   put:
 *     summary: Actualizar un tipo de documento
 *     tags: [tip_doc]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del tipo de documento a actualizar
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
 *               tip_doc:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tipo de documento actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/tip_doc'
 *       404:
 *         description: Tipo de documento no encontrado
*/
// 4.Creamos la ruta para actualizar un documento en la coleccion tip_doc
router.put("/tip_doc/:id", updateTipDoc);


/**
 * @swagger
 /tip_doc/{id}:
  delete:
    summary: Elimina un tipo de documento
    tags: [tip_doc]
    parameters:
      - in: path
        name: id
        description: ID del tipo de documento a eliminar
        required: true
        schema:
          type: string
    responses:
      200:
        description: Tipo de documento eliminado exitosamente
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: Tipo de documento eliminado exitosamente
      404:
        description: Tipo de documento no encontrado
      500:
        description: Error al eliminar el tipo de documento
 */
// 5.Creamos la ruta para borrar un documento de mi bdd en la coleccion tip_doc
router.delete("/tip_doc/:id", deleteTipDoc);

export default router;
