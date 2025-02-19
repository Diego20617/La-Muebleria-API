import productoSchema from "../models/Producto_model.js";
import { validatorHandler } from "../middleware/validator.handler.js";
import {
    createProductoSchema,
    getProductoSchema,
    updateProductoSchema,
    deleteProductoSchema,
} from "../validators/ProductoValidatorDTO.js";



/**
 * @swagger
components:
  schemas:
    producto:
      type: object
      properties:
        _id:
          type: string
          description: ID autogenerado en la BD
        producto:
          type: string
          description: Nombre del producto
        dimensiones:
          type: Number
          description: Dimensiones del producto
        descripcion:
          type: string
          description: Descripcion del producto
        id_tipo_producto:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID del tipo de producto relacionado
      required:
        - producto
        - dimensiones
        - descripcion
        - id_tipo_producto
      example:
        producto: armario
        dimensiones: 1.5
        descripcion: mueble de madera
        id_tipo_producto: 674538b861d4d2be66b1dde0
*/


//1. res.send("Esta ruta esta pensada para crear un usuario nuevo");
export const createProducto = [
    validatorHandler(createProductoSchema, "body"),
    async (req, res) => {
        const producto = new productoSchema(req.body);
        await producto
            .save()
            .then((data) => res.status(201).json(data)) // Cambio el código de estado a 201 para indicar que se creó un nuevo recurso
            .catch((error) => res.status(500).json({ message: error.message })); // Asegúrate de enviar error.message para obtener un mensaje más claro
    },
];



//2.Obtener
export const getProducto = (req, resp) => {
    productoSchema
        .find() //Metodo para buscar todos los docs de una coleccion
        .then((data) => resp.json(data))
        .catch((error) => resp.json({ message: error }));
};

//3.Obtener por id
export const getAllProducto = [
    validatorHandler(getProductoSchema, "params"),
    async (req, resp) => {
        const { id } = req.params;
        try {
            //Metodo usado para buscar un documento de una coleccion
            const producto = await productoSchema.findById(id);
            if (!producto) {
                return resp.status(404).json({
                    message: "Usuario no encontrado",
                });
            }
            resp.json(producto);
        } catch (error) {
            resp.status(500).json({
                message: error.message,
            });
        }
    },
];

export const getAllProductoWithTipProducto = [
    validatorHandler(getProductoSchema, "params"),
    async (req, resp) => {
        const { id } = req.params;
        try {
            const producto = await productoSchema.findById(id).populate("tipo_producto"); // Usar populate para incluir las categorías relacionadas
            if (!producto) {
                return resp.status(404).json({ message: "Producto no encontrado" });
            }
            resp.json(producto);
        } catch (error) {
            resp.status(500).json({ message: error.message });
        }
    },
];



//4.Actualizar
export const updateProducto = [
    validatorHandler(getProductoSchema, "params"),
    validatorHandler(updateProductoSchema, "body"),
    async (req, resp) => {
        const { id } = req.params;
        const { producto, dimensiones, descripcion, id_tipo_producto } = req.body;
        try {
            // Obtener el tipo de producto actual
            const updateProducto = await productoSchema.findById(id);
            if (!updateProducto) {
                return resp.status(404).json({ message: "Tipo de producto no encontrdo" });
            }
            // Si no se proporcionan id del tipo de producto en la solicitud, mantener el id_usuario actual
            const updateTipProducto =
                id_tipo_producto !== undefined ? id_tipo_producto : updateProducto.id_tipo_producto;
            const tipProductopdate = await productoSchema.updateOne(
                { _id: id },
                { $set: { producto, dimensiones, descripcion, id_tipo_producto: updateTipProducto } }
            );
            if (tipProductopdate.matchedCount === 0) {
                return resp.status(404).json({ message: "Tipo de producto no encontrado" });
            }
            if (tipProductopdate.modifiedCount === 0) {
                return resp
                    .status(400)
                    .json({ message: "No se realizaron cambios en el tipo de producto" });
            }
            resp.status(200).json({ message: "Tipo de producto actualizado correctamente" });
        } catch (error) {
            resp.status(500).json({ message: error.message });
        }
    },
];


//5.Borrar
export const deleteProducto = [
    validatorHandler(deleteProductoSchema, "params"),

    async (req, resp) => {
        const { id } = req.params;
        try {
            const result = await productoSchema.deleteOne({ _id: id });
            if (result.deletedCount === 0) {
                return resp.status(404).json({ message: "Producto no encontrado" });
            }
            return resp.status(200).json({ message: "Producto eliminado correctamente" });
        } catch (error) {
            return resp.status(500).json({ message: error.message });
        }
    },
];