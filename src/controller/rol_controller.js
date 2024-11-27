import rol_model from "../models/rol_model.js";
import { validatorHandler } from "../middleware/validator.handler.js";
import {
  createRolSchema,
  getRolSchema,
  updateRolSchema,
  deleteRolSchema,
} from "../validators/rolValidatorDTO.js";
/**
 * @swagger
 * components:
 *   schemas:
 *     Rol:
 *       type: object
 *       properties:
 *         rol:
 *           type: string
 *           description: Nombre del rol
 *           required: true
 *         estados:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID del estado relacionado
 *       example:
 *         nombre: Administrador
 *         estados:
 *           - id: 5f9b6af8f96d26f00473e566
 */


//1.Crear
export const createRol = [
  validatorHandler(createRolSchema, "body"),
  async (req, res) => {
    const rol = new rol_model(req.body);
    await rol
      .save()
      .then((data) => res.status(201).json(data)) // Cambio el código de estado a 201 para indicar que se creó un nuevo recurso
      .catch((error) => res.status(500).json({ message: error.message })); // Asegúrate de enviar `error.message` para obtener un mensaje más claro
  },
];


//2.Obtener
export const getRol = (req, resp) => {
    rol_model
        .find()
        .then((data) => resp.json (data))
        .catch((error) => resp.json({message: error }));
};


//3.Obtener por id
export const getAllRol = [
  validatorHandler(getRolSchema, "params"),
  async (req, resp) => {
    const { id } = req.params;
    try {
      const rol = await rol_model.findById(id); //Metodo usado para buscar un documento de una coleccion
      if (!rol) {
        return resp.status(404).json({
          message: "Rol no encontrado",
        });
      }
      resp.json(rol);
    } catch (error) {
      resp.status(500).json({
        message: error.message,
      });
    }
  },
];

export const getAllRolWithEstado = [
  validatorHandler(getRolSchema, "params"),
  async (req, resp) => {
    const { id } = req.params;
    try {
      const rol = await rol_model.findById(id).populate("estado"); // Usar populate para incluir las categorías relacionadas
      if (!rol) {
        return resp.status(404).json({ message: "Rol no encontrado" });
      }
      resp.json(rol);
    } catch (error) {
      resp.status(500).json({ message: error.message });
    }
  },
];


//4.Actualizar
export const updateRol = [
  validatorHandler(getRolSchema, "params"),
  validatorHandler(updateRolSchema, "body"),
  async (req, resp) => {
    const { id } = req.params;
    const { rol, id_estado } = req.body;
    try {
      // Obtener el rol actual
      const currentRol = await rol_model.findById(id);
      if (!currentRol) {
        return resp.status(404).json({ message: "Rol no encontrado" });
      }
      // Si no se proporciona el id_estado en la solicitud, mantener el id_estado actual
      const updateEstado =
        id_estado !== undefined ? id_estado : currentRol.id_estado;
      const rolUpdate = await rol_model.updateOne(
        { _id: id },
        { $set: { rol, id_estado: updateEstado } }
      );
      if (rolUpdate.matchedCount === 0) {
        return resp.status(404).json({ message: "Rol no encontrado" });
      }
      if (rolUpdate.modifiedCount === 0) {
        return resp
          .status(400)
          .json({ message: "No se realizaron cambios en el rol" });
      }
      resp.status(200).json({ message: "Rol actualizado correctamente" });
    } catch (error) {
      resp.status(500).json({ message: error.message });
    }
  },
];


//5.Borrar
export const deleteRol = [
  validatorHandler(deleteRolSchema, "params"),

  async (req, resp) => {
    const { id } = req.params;
    try {
      const result = rol_model.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        resp.status(404).json({ message: "Rol no encontrado" });
      }
      resp.status(200).json({ message: "Rol eliminado correctamente" });
    } catch (error) {
      resp.status(500).json({ message: error.message });
    }
  },
];


