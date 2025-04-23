import express from 'express';
import Login from '../controller/autenticacion_controller.js';

const autenticacionRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Operaciones relacionadas con la autenticación de usuarios.
 */

/** 
 * @swagger
 * /api/autenticacion/login:
 *   post:
 *     summary: Realiza la autenticación del usuario
 *     description: Permite al usuario autenticarse proporcionando un correo electrónico y contraseña.
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *                 description: El correo electrónico del usuario.
 *                 example: user@example.com
 *               contraseña:
 *                 type: string
 *                 description: La contraseña del usuario.
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Autenticación exitosa, devuelve un token JWT.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para el acceso a la API.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Error de validación, los campos correo o contraseña no están correctos.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error interno en el servidor.
 */

autenticacionRouter.post('/login', Login);

export default autenticacionRouter;
