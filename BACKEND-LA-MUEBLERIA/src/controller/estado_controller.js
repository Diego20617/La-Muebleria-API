import estado_model from "../models/estado_model.js";
import { validatorHandler } from "../middleware/validator.handler.js";
import {
  createEstadoSchema,
  getEstadoSchema,
  updateEstadoSchema,
  deleteEstadoSchema,
} from "../validators/estadoValidatorDTO.js";


//1.res.send("Esta ruta esta pensada para crear un usuario nuevo");
export const createEstado = [
  validatorHandler(createEstadoSchema, "body"),
  async (req, res) => {
    const estado = new estado_model(req.body);
    await estado
      .save()
      .then((data) => res.status(201).json(data)) // Cambio el código de estado a 201 para indicar que se creó un nuevo recurso
      .catch((error) => res.status(500).json({ message: error.message })); // Asegúrate de enviar `error.message` para obtener un mensaje más claro
  },
];



//2.Obtener
export const getEstado = (req, resp) => {
    estado_model
        .find() //Metodo para buscar todos los docs de una coleccion
        .then((data) => resp.json(data))
        .catch((error) => resp.json({ message: error }));
};

//3.Obtener por id
export const getAllEstado = [
  validatorHandler(getEstadoSchema, "params"),
  async (req, resp) => {
    const { id } = req.params;
    try {
      //Metodo usado para buscar un documento de una coleccion
      const estado = await estado_model.findById(id);
      if (!estado) {
        return resp.status(404).json({
          message: "Estado no encontrado",
        });
      }
      resp.json(estado);
    } catch (error) {
      resp.status(500).json({
        message: error.message,
      });
    }
  },
];


//4.Actualizar
export const updateEstado = [
  validatorHandler(getEstadoSchema, "params"),
  validatorHandler(updateEstadoSchema, "body"),
  async (req, resp) => {
    const { id } = req.params;
    const { estado } = req.body;
    try {
      const estadoUpdate = await estado_model.updateOne(
        { _id: id },
        { $set: { estado } }
      );
      if (estadoUpdate.matchedCount === 0) {
        return resp.status(404).json({ message: "Estado no encontrada" });
      }
      if (estadoUpdate.modifiedCount === 0) {
        return resp
          .status(400)
          .json({ message: "No se realizaron cambios en el estado" });
      }
      resp.status(200).json({ message: "Estado actualizado correctamente" });
    } catch (error) {
      resp.status(500).json({ message: error.message });
    }
  },
];


//5.Borrar
export const deleteEstado = [
  validatorHandler(deleteEstadoSchema, "params"),

  async (req, resp) => {
    const { id } = req.params;
    try {
      const result = estado_model.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        resp.status(404).json({ message: "Estado no encontrada" });
      }
      resp.status(200).json({ message: "Estado eliminado correctamente" });
    } catch (error) {
      resp.status(500).json({ message: error.message });
    }
  },
];
