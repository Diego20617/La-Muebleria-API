import usuario_model from "../models/usuario_model.js";
import { validatorHandler} from "../middleware/validator.handler.js";
import {
  createUsuarioSchema,
  getUsuarioSchema,
  updateUsuarioSchema,
  deleteUsuarioSchema,
} from "../validators/usuarioValidatorDTO.js";

/**
 * @swagger
components:
  schemas:
    User:
      type: object
      properties:
        _id:
          type: string
          description: ID autogenerado en la BD
        nombres:
          type: string
          description: Nombres del usuario
        apellidos:
          type: string
          description: Apellidos del usuario
        correo:
          type: string
          description: Correo electrónico del usuario
        num_doc:
          type: number
          description: Número de documento del usuario
        contraseña:
          type: string
          description: Contraseña del usuario
        genero:
          type: string
          enum: [M, F, Otro]
          description: Género del usuario
      required:
        - nombres
        - apellidos
        - correo
        - num_doc
        - contraseña
        - genero
      example:
        nombres: Julian Felipe
        apellidos: Pacheco Pineda
        correo: julian@example.com
        num_doc: 123456789
        contraseña: mystrongpassword
        genero: M
*/


//1. res.send("Esta ruta esta pensada para crear un usuario nuevo");
export const createUsuario = [
  validatorHandler(createUsuarioSchema, "body"),
  async (req, res) => {
    const category = new usuario_model(req.body);
    await category
      .save()
      .then((data) => res.status(201).json(data)) // Cambio el código de estado a 201 para indicar que se creó un nuevo recurso
      .catch((error) => res.status(500).json({ message: error.message })); // Asegúrate de enviar `error.message` para obtener un mensaje más claro
  },
];



//2.Obtener
export const getUsuario = (req, resp) => {
    usuario_model
        .find() //Metodo para buscar todos los docs de una coleccion
        .then((data) => resp.json(data))
        .catch((error) => resp.json({ message: error }));
};

//3.Obtener por id
export const getAllUsuario = [
  validatorHandler(getUsuarioSchema, "params"),
  async (req, resp) => {
    const { id } = req.params;
    try {
      //Metodo usado para buscar un documento de una coleccion
      const usuario = await usuario_model.findById(id);
      if (!usuario) {
        return resp.status(404).json({
          message: "Usuario no encontrado",
        });
      }
      resp.json(usuario);
    } catch (error) {
      resp.status(500).json({
        message: error.message,
      });
    }
  },
];



//4.Actualizar
export const updateUsuario = [
  validatorHandler(getUsuarioSchema, "params"),
  validatorHandler(updateUsuarioSchema, "body"),
  async (req, resp) => {
    const { id } = req.params;
    const { nombres, apellidos, correo, num_doc, contraseña } = req.body;
    try {
      const usuarioUpdate = await usuario_model.updateOne(
        { _id: id },
        { $set: { nombres, apellidos, correo, num_doc, contraseña } }
      );
      if (usuarioUpdate.matchedCount === 0) {
        return resp.status(404).json({ message: "Usuario no encontrado" });
      }
      if (usuarioUpdate.modifiedCount === 0) {
        return resp
          .status(400)
          .json({ message: "No se realizaron cambios en el usuario" });
      }
      resp.status(200).json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
      resp.status(500).json({ message: error.message });
    }
  },
];


//5.Borrar
export const deleteUsuario = [
  validatorHandler(deleteUsuarioSchema, "params"),

  async (req, resp) => {
    const { id } = req.params;
    try {
      const result = usuario_model.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        resp.status(404).json({ message: "Usuario no encontrado" });
      }
      resp.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      resp.status(500).json({ message: error.message });
    }
  },
];
