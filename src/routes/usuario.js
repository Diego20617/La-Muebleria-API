import express from "express";
import { deleteUsuario, updateUsuario , getAllUsuario, getUsuario , createUsuario } from '../controller/usuario_controller.js'

const router = express.Router();

/**
 * @swagger
/usuario:
  post:
    summary: Crea un nuevo usuario
    tags: [usuario]
    requestBody:
      required: true
      content:
        application/json:
          schema:
          type: object
            $ref: '#/components/schemas/usuario'
    responses:
      200:
        description: Usuario creado exitosamente
 */
//Creamos el ler endpoint
router.post("/usuario", createUsuario);


/**
 * @swagger
/usuario:
  get:
    summary: Retorna los registros de los usuarios
    tags: [usuario]
    responses:
      200:
        description: Esta es la lista de usuarios registrados
        content:
          application/json:
            schema:
            type: array
            items:
            $ref: '#/components/schemas/usuario'
 */
//2.Creamos la ruta para obtener todos los documentos de mi bdd en la colection users
router.get("/usuario", getUsuario);

// 3.Creamos la ruta para consultar un documento de mi bdd en la coleccion users
router.get("/usuario/:id", getAllUsuario);


/**
 * @swagger
 * /usuario/{id}:
 *   put:
 *     summary: Actualiza un usuario
 *     tags: [usuario]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del usuario a actualizar
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
 *               nombres:
 *                 type: string
 *               apellidos:
 *                 type: string
 *               correo:
 *                 type: string
 *               num_doc:
 *                 type: Number
 *               contraseña:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/usuario'
 *       404:
 *         description: Usuario no encontrado
 */
// 4.Creamos la ruta para actualizar un documento en la coleccion users
router.put("/usuario/:id", updateUsuario);


/**
 * @swagger
 /usuario/{id}:
  delete:
    summary: Elimina un usuario
    tags: [usuario]
    parameters:
      - in: path
        name: id
        description: ID del usuario a eliminar
        required: true
        schema:
          type: string
    responses:
      200:
        description: Usuario eliminado exitosamente
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: Usuario eliminado exitosamente
      404:
        description: Usuario no encontrado
      500:
        description: Error al eliminar el usuario
 */
// 5.Creamos la ruta para borrar un documento de mi bdd en la coleccion users
router.delete("/usuario/:id", deleteUsuario);

export default router;