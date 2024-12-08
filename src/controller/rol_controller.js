import rol_model from "../models/rol_model.js";
import { validatorHandler } from "../middleware/validator.handler.js";
import {
  createRolSchema,
  getRolSchema,
  updateRolSchema,
  deleteRolSchema,
} from "../validators/rolValidatorDTO.js";

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


//2.Obtener todos loa roles
export const getRol = (req, resp) => {
  rol_model
    .find()
    .populate("id_estado", "nombre") // Traer solo el campo 'nombre' del estado
    .then((data) => resp.json(data))
    .catch((error) => resp.status(500).json({ message: error.message }));
};

//3.Obtener por id
export const getAllRol = [
  validatorHandler(getRolSchema, "params"),
  async (req, resp) => {
    const { id } = req.params;
    try {
      const rol = await rol_model.findById(id).populate("id_estado", "estado");
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
      const rol = await rol_model.findById(id).populate("id_estado", "estado");
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
      // Actualizar y devolver el documento
      const rolUpdate = await rol_model
        .findByIdAndUpdate(
          id,
          { rol, id_estado },
          { new: true } // Devuelve el documento actualizado
        )
        .populate("id_estado", "estado"); // Solo traer 'nombre' del estado

      if (!rolUpdate) {
        return resp.status(404).json({ message: "Rol no encontrado" });
      }

      resp.status(200).json({
        message: "Rol actualizado correctamente",
        data: rolUpdate,
      });
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


