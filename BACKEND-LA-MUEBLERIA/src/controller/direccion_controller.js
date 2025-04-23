import direccion_model from "../models/direccion_model.js";
import { validatorHandler } from "../middleware/validator.handler.js";
import {
  createDireccionSchema,
  getDireccionSchema,
  updateDireccionSchema,
  deleteDireccionSchema,
} from "../validators/direccionValidatorDTO.js";

//   res.send("Esta ruta esta pensada para crear un usuario nuevo");
export const createDireccion = [
  validatorHandler(createDireccionSchema, "body"),
  async (req, res) => {
    const direccion = new direccion_model(req.body);
    await direccion
      .save()
      .then((data) => res.status(201).json(data)) // Cambio el código de estado a 201 para indicar que se creó un nuevo recurso
      .catch((error) => res.status(500).json({ message: error.message })); // Asegúrate de enviar `error.message` para obtener un mensaje más claro
  },
];


//2.Obtener
export const getDireccion = (req, resp) => {
    direccion_model
        .find() //Metodo usado para buscar todos los docs de una coleccion
        .then((data) => resp.json (data))
        .catch((error) => resp.json({message: error }));
};


//3.Obtener por id
export const getAllDireccion = [
  validatorHandler(getDireccionSchema, "params"),
  async (req, resp) => {
    const { id } = req.params;
    try {
      //Metodo usado para buscar un documento de una coleccion
      const direccion = await direccion_model.findById(id);
      if (!direccion) {
        return resp.status(404).json({
          message: "Direccion no encontrada",
        });
      }
      resp.json(direccion);
    } catch (error) {
      resp.status(500).json({
        message: error.message,
      });
    }
  },
];


//4.Actualizar
export const updateDireccion = [
  validatorHandler(getDireccionSchema, "params"),
  validatorHandler(updateDireccionSchema, "body"),
  async (req, resp) => {
    const { id } = req.params;
    const { direccion } = req.body;
    try {
      const direccionUpdate = await direccion_model.updateOne(
        { _id: id },
        { $set: { direccion } }
      );
      if (direccionUpdate.matchedCount === 0) {
        return resp.status(404).json({ message: "Direccion no encontrada" });
      }
      if (direccionUpdate.modifiedCount === 0) {
        return resp
          .status(400)
          .json({ message: "No se realizaron cambios en la direccion" });
      }
      resp.status(200).json({ message: "Direccion actualizada correctamente" });
    } catch (error) {
      resp.status(500).json({ message: error.message });
    }
  },
];


//5.Borrar
export const deleteDireccion = [
  validatorHandler(deleteDireccionSchema, "params"),

  async (req, resp) => {
    const { id } = req.params;
    try {
      const result = direccion_model.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        resp.status(404).json({ message: "Direccion no encontrada" });
      }
      resp.status(200).json({ message: "Direccion eliminada correctamente" });
    } catch (error) {
      resp.status(500).json({ message: error.message });
    }
  },
];
