import pedido_model from "../models/pedido_model.js";
import {validatorHandler} from "../middleware/validator.handler.js";
import {
  createPedidoSchema,
  getPedidoSchema,
  updatePedidoSchema,
  deletePedidoSchema,
} from "../validators/pedidoValidatorDTO.js";
/**
 * @swagger
 * components:
 *   schemas:
 *     Pedido:
 *       type: object
 *       properties:
 *         cant_productos:
 *           type: string
 *           description: Cantidad de productos en el pedido
 *           required: true
 *         id_direccion:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID de la dirección relacionada
 *       example:
 *         cant_productos: 5
 *         id_direccion:
 *           - id: 5f9b6af8f96d26f00473e566
 */


//1.Crear
export const createPedido = [
  validatorHandler(createPedidoSchema, "body"),
  async (req, res) => {
    const pedido = new pedido_model(req.body);
    await pedido
      .save()
      .then((data) => res.status(201).json(data)) // Cambio el código de estado a 201 para indicar que se creó un nuevo recurso
      .catch((error) => res.status(500).json({ message: error.message })); // Asegúrate de enviar `error.message` para obtener un mensaje más claro
  },
];



//2.Obtener
export const getPedido = (req, resp) => {
    pedido_model
        .find()
        .then((data) => resp.json (data))
        .catch((error) => resp.json({message: error }));
};


//3.Obtener por id
export const getAllPedido = [
  validatorHandler(getPedidoSchema, "params"),
  async (req, resp) => {
    const { id } = req.params;
    try {
      const pedido = await pedido_model.findById(id); //Metodo usado para buscar un documento de una coleccion
      if (!pedido) {
        return resp.status(404).json({
          message: "Pedido no encontrado",
        });
      }
      resp.json(pedido);
    } catch (error) {
      resp.status(500).json({
        message: error.message,
      });
    }
  },
];

export const getAllPedidodWithDireccion = [
  validatorHandler(getPedidoSchema, "params"),
  async (req, resp) => {
    const { id } = req.params;
    try {
      const pedido = await pedido_model.findById(id).populate("direccion"); // Usar populate para incluir las categorías relacionadas
      if (!pedido) {
        return resp.status(404).json({ message: "Pedido no encontrado" });
      }
      resp.json(pedido);
    } catch (error) {
      resp.status(500).json({ message: error.message });
    }
  },
];


//4.Actualizar
export const updatePedido = [
  validatorHandler(getPedidoSchema, "params"),
  validatorHandler(updatePedidoSchema, "body"),
  async (req, resp) => {
    const { id } = req.params;
    const { cant_productos, id_direccion } = req.body;
    try {
      // Obtener el pedido actual
      const currentPedido = await pedido_model.findById(id);
      if (!currentPedido) {
        return resp.status(404).json({ message: "Pedido no encontrado" });
      }
      // Si no se proporcionan las direcciones en la solicitud, mantener las direcciones actuales
      const updatedDireccion =
        id_direccion !== undefined ? id_direccion : currentPedido.id_direccion;
      const markUpdate = await pedido_model.updateOne(
        { _id: id },
        { $set: { cant_productos, id_direccion: updatedDireccion } }
      );
      if (markUpdate.matchedCount === 0) {
        return resp.status(404).json({ message: "Pedido no encontrado" });
      }
      if (markUpdate.modifiedCount === 0) {
        return resp
          .status(400)
          .json({ message: "No se realizaron cambios en el pedido" });
      }
      resp.status(200).json({ message: "Pedido actualizada correctamente" });
    } catch (error) {
      resp.status(500).json({ message: error.message });
    }
  },
];


//5.Borrar
export const deletePedido = [
  validatorHandler(deletePedidoSchema, "params"),

  async (req, resp) => {
    const { id } = req.params;
    try {
      const result = pedido_model.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        resp.status(404).json({ message: "Pedido no encontrado" });
      }
      resp.status(200).json({ message: "Pedido eliminado correctamente" });
    } catch (error) {
      resp.status(500).json({ message: error.message });
    }
  },
];
