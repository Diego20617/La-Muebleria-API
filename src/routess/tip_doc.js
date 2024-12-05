import express from "express";
import { createTipDoc, getTipDoc, getAllTipDoc, updateTipDoc, getAllTipDocWithUsuarios, deleteTipDoc} from '../controller/tip_doc_controller.js'

const router = express.Router(); 
/**
 * @swagger
 * components:
 *   schemas:
 *     tip_doc:
 *       type: object
 *       properties:
 *         tip_doc:
 *           type: string
 *           description: Tipo de documento de identificación del usuario
 *         id_usuario:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID del usuario relacionado
 *       required:
 *         - tip_doc
 *       example:
 *         tip_doc: CC
 *         id_usuario:
 *           - id: "15256rf1511rf15"
 */

/**
 * @swagger
 * /tip_doc:
 *   post:
 *     summary: Crea un nuevo tipo de documento
 *     tags: 
 *       - tip_doc
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/tip_doc'
 *     responses:
 *       200:
 *         description: Tipo de documento creado exitosamente
 */
router.post("/tip_doc", createTipDoc);

/**
 * @swagger
 * /tip_doc:
 *   get:
 *     summary: Retorna los registros de los tipos de documentos
 *     tags: 
 *       - tip_doc
 *     responses:
 *       200:
 *         description: Lista de los tipos de documentos registrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/tip_doc'
 */
router.get("/tip_doc", getTipDoc);

/**
 * @swagger
 * /tip_doc/{id}:
 *   get:
 *     summary: Obtiene un tipo de documento por ID
 *     tags: 
 *       - tip_doc
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del tipo de documento
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tipo de documento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/tip_doc'
 *       404:
 *         description: Tipo de documento no encontrado
 */
router.get("/tip_doc/:id", getAllTipDoc);

/**
 * @swagger
 * /tip_doc/{id}/usuario:
 *   get:
 *     summary: Obtiene usuarios asociados a un tipo de documento
 *     tags: 
 *       - tip_doc
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del tipo de documento
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de usuarios asociados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ID del usuario
 *       404:
 *         description: Tipo de documento no encontrado
 */
router.get("/tip_doc/:id/usuario", getAllTipDocWithUsuarios);

/**
 * @swagger
 * /tip_doc/{id}:
 *   put:
 *     summary: Actualizar un tipo de documento
 *     tags: 
 *       - tip_doc
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
 *             $ref: '#/components/schemas/tip_doc'
 *     responses:
 *       200:
 *         description: Tipo de documento actualizado exitosamente
 *       404:
 *         description: Tipo de documento no encontrado
 */
router.put("/tip_doc/:id", updateTipDoc);

/**
 * @swagger
 * /tip_doc/{id}:
 *   delete:
 *     summary: Elimina un tipo de documento
 *     tags: 
 *       - tip_doc
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del tipo de documento a eliminar
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tipo de documento eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tipo de documento eliminado exitosamente
 *       404:
 *         description: Tipo de documento no encontrado
 *       500:
 *         description: Error al eliminar el tipo de documento
 */
router.delete("/tip_doc/:id", deleteTipDoc);

export default router;
