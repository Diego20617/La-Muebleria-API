import tip_doc_model from "../models/tip_doc_model.js";
import { validatorHandler } from "../middleware/validator.handler.js";
import {
  createTip_docSchema,
  getTip_docSchema,
  updateTip_docSchema,
  deleteTip_docSchema,
} from "../validators/tip_docValidatorDTO.js";
/**
 * @swagger
 components:
  schemas:
    tip_doc:
      type: object
      properties:
        tip_doc:
          type: string
          description: Tipo de documento de identificación del usuario
      required:
        - tip_doc
        id_usuario:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID del usuario relacionado
      example:
        tip_doc: CC
        id_usuario: 15256rf1511rf15
*/ 



//1.Crear
export const createTipDoc = [
  validatorHandler(createTip_docSchema, "body"),
  async (req, res) => {
    const tip_doc = new tip_doc_model(req.body);
    await tip_doc
      .save()
      .then((data) => res.status(201).json(data)) // Cambio el código de estado a 201 para indicar que se creó un nuevo recurso
      .catch((error) => res.status(500).json({ message: error.message })); // Asegúrate de enviar `error.message` para obtener un mensaje más claro
  },
];



//2.Obtener
export const getTipDoc = (req, resp) => {
    tip_doc_model
        .find() //Metodo para buscar todos los docs de una coleccion
        .then((data) => resp.json(data))
        .catch((error) => resp.json({ message: error }));
};

//3.Obtener por id
export const getAllTipDoc = [
  validatorHandler(getTip_docSchema, "params"),
  async (req, resp) => {
    const { id } = req.params;
    try {
      const tip_doc = await tip_doc_model.findById(id); //Metodo usado para buscar un documento de una coleccion
      if (!tip_doc) {
        return resp.status(404).json({
          message: "Tipo de documento no encontrado",
        });
      }
      resp.json(mark);
    } catch (error) {
      resp.status(500).json({
        message: error.message,
      });
    }
  },
];

export const getAllTipDocWithUsuarios = [
  validatorHandler(getTip_docSchema, "params"),
  async (req, resp) => {
    const { id } = req.params;
    try {
      const tip_doc = await tip_doc_model.findById(id).populate("usuario"); // Usar populate para incluir las categorías relacionadas
      if (!tip_doc) {
        return resp.status(404).json({ message: "Tipo de documento no encontrado" });
      }
      resp.json(tip_doc);
    } catch (error) {
      resp.status(500).json({ message: error.message });
    }
  },
];



//4.Actualizar
export const updateTipDoc = [
  validatorHandler(getTip_docSchema, "params"),
  validatorHandler(updateTip_docSchema, "body"),
  async (req, resp) => {
    const { id } = req.params;
    const { tip_doc, id_usuario } = req.body;
    try {
      // Obtener el tipo de documento actual
      const currentTipDoc = await tip_doc_model.findById(id);
      if (!currentTipDoc) {
        return resp.status(404).json({ message: "Tipo de dicumento no encontrdo" });
      }
      // Si no se proporcionan id_usuario en la solicitud, mantener el id_usuario actual
      const updateUsuario =
        id_usuario !== undefined ? id_usuario : currentTipDoc.id_usuario;
      const tipDocUpdate = await tip_doc_model.updateOne(
        { _id: id },
        { $set: { tip_doc, id_usuario : updateUsuario } }
      );
      if (tipDocUpdate.matchedCount === 0) {
        return resp.status(404).json({ message: "Tipo de documento no encontrado" });
      }
      if (tipDocUpdate.modifiedCount === 0) {
        return resp
          .status(400)
          .json({ message: "No se realizaron cambios en el tipo de documento" });
      }
      resp.status(200).json({ message: "Tipo de documento actualizado correctamente" });
    } catch (error) {
      resp.status(500).json({ message: error.message });
    }
  },
];



//5.Borrar
export const deleteTipDoc = [
  validatorHandler(deleteTip_docSchema, "params"),

  async (req, resp) => {
    const { id } = req.params;
    try {
      const result = tip_doc_model.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        resp.status(404).json({ message: "Tipo de documento no encontrado" });
      }
      resp.status(200).json({ message: "Tipo de documento eliminado correctamente" });
    } catch (error) {
      resp.status(500).json({ message: error.message });
    }
  },
];

