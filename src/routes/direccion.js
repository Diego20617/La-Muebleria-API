import express from "express";
import { createDireccion,getDireccion, getAllDireccion, updateDireccion, deleteDireccion} from '../controller/direccion_controller.js'

const router = express.Router(); 


/**
 * @swagger
/direccion:
  post:
    summary: Crea un nuevo tipo de direccion
    tags: [direccion]
    requestBody:
      required: true
      content:
        application/json:
          schema:
          type: object
            $ref: '#/components/schemas/direccion'
    responses:
      200:
        description: Direccion creada exitosamente
 */
//Creamos el ler endpoint
router.post("/tip_doc",createDireccion);


/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Obtiene todas las direcciones
 *     responses:
 *       200:
 *         description: Lista de direcciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/direccion'
 */
//2.Creamos la ruta para obtener todos los documentos de mi bdd en la colection tip_doc
router.get("/tip_doc", getDireccion);

// 3.Creamos la ruta para consultar un documento de mi bdd en la coleccion tip_doc
router.get("/tip_doc/:id", getAllDireccion);


/**
 * @swagger
 * /direcciones/{id}:
 *   put:
 *     summary: Actualizar una dirección
 *     tags: [direcciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de la dirección a actualizar
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
 *               direccion:
 *                 type: string
 *                 description: Nueva dirección
 *     responses:
 *       200:
 *         description: Dirección actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Direccion'
 *       404:
 *         description: Dirección no encontrada
 */
// 4.Creamos la ruta para actualizar un documento en la coleccion tip_doc
router.put("/tip_doc/:id", updateDireccion);


/** 
 * @swagger
direccion/{id}:
  delete:
    summary: Elimina una direccion
    tags: [direccion]
    parameters:
      - in: path
        name: id
        description: ID de la direccion a eliminar
        required: true
        schema:
          type: string
    responses:
      200:
        description: Direccion eliminada exitosamente
      404:
        description: Direccion no encontrada
      500:
        description: Error al eliminar la direccion
*/
// 5.Creamos la ruta para borrar un documento de mi bdd en la coleccion tip_doc
router.delete("/tip_doc/:id", deleteDireccion);

export default router;
