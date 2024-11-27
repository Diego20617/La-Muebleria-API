import express from "express"

import { createRol, getRol, getAllRol, updateRol, getAllRolWithEstado, deleteRol} from '../controller/rol_controller.js';

const router = express.Router();


/**
 * @swagger
/rol:
  post:
    summary: Crea un nuevo tipo de rol
    tags: [rol]
    requestBody:
      required: true
      content:
        application/json:
          schema:
          type: object
            $ref: '#/components/schemas/rol'
    responses:
      200:
        description: Tipo de rol creado exitosamente
 */
//Creamos el 1er endpoint
router.post("/rol", createRol);


/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Obtiene todos los roles
 *     responses:
 *       200:
 *         description: Lista de roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/rol'
 */
//2RUTA PARA OBTENER TODOS LOS USUARIOS DE LA BASE DE DATOS
router.get("/rol", getRol);

//3RUTA PARA OBTENER USUARIO ESPECIFICO DE LA BASE DE DATOS
router.get("/rol/:id", getAllRol);

router.get("/rol/:id/estado", getAllRolWithEstado);


/**
 * @swagger
 * /rol/{id}:
 *   put:
 *     summary: Actualizar rol
 *     tags: [rol]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del rol a actualizar
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
 *               rol:
 *                 type: string
 *               id_estado:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Rol actualizado correctamente 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/rol'
 *       404:
 *         description: Rol no encontrado
 */
//4RUTA PARA ACTUALIZAR USUARIO DE LA BASE DE DATOS
router.put("/rol/:id", updateRol);


/** 
 * @swagger
/rol/{id}:
  delete:
    summary: Elimina un rol
    tags: [rol]
    parameters:
      - in: path
        name: id
        description: ID del rol a eliminar
        required: true
        schema:
          type: string
    responses:
      200:
        description: Rol eliminado exitosamente
      404:
        description: Rol no encontrado
      500:
        description: Error al eliminar el rol
*/
//5RUTA PARA ELIMINAR USUARIO DE LA BASE DE DATOS
router.delete("/rol/:id", deleteRol);

export default router;
