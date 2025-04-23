import tipo_producto_model from "../models/tipo_producto_model.js";
import { validatorHandler } from "../middleware/validator.handler.js";
import {
    createTipoProductoSchema,
    getTipoProductoSchema,
    updateTipoProductoSchema,
    deleteTipoProductoSchema,
} from "../validators/tipoProductoValidatorDTO.js";

// 1. Crear un nuevo tipo de producto
export const createTipoProducto = [
    validatorHandler(createTipoProductoSchema, "body"),
    async (req, res) => {
        const tipoProducto = new tipo_producto_model(req.body);
        await tipoProducto
            .save()
            .then((data) => res.status(201).json(data))
            .catch((error) => res.status(500).json({ message: error.message }));
    },
];

// 2. Obtener todos los tipos de producto
export const getTipoProducto = (req, res) => {
    tipo_producto_model
        .find()
        .then((data) => res.json(data))
        .catch((error) => res.status(500).json({ message: error.message }));
};

// 3. Obtener tipo de producto por ID
export const getAllTipoProducto = [
    validatorHandler(getTipoProductoSchema, "params"),
    async (req, res) => {
        const { id } = req.params;
        try {
            const tipoProducto = await tipo_producto_model.findById(id);
            if (!tipoProducto) {
                return res.status(404).json({ message: "Tipo de producto no encontrado" });
            }
            res.json(tipoProducto);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
];

// 4. Actualizar tipo de producto
export const updateTipoProducto = [
    validatorHandler(getTipoProductoSchema, "params"),
    validatorHandler(updateTipoProductoSchema, "body"),
    async (req, res) => {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        try {
            const tipoProductoUpdate = await tipo_producto_model.updateOne(
                { _id: id },
                { $set: { nombre, descripcion } }
            );
            if (tipoProductoUpdate.matchedCount === 0) {
                return res.status(404).json({ message: "Tipo de producto no encontrado" });
            }
            if (tipoProductoUpdate.modifiedCount === 0) {
                return res.status(400).json({ message: "No se realizaron cambios en el tipo de producto" });
            }
            res.status(200).json({ message: "Tipo de producto actualizado correctamente" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
];

// 5. Eliminar tipo de producto
export const deleteTipoProducto = [
    validatorHandler(deleteTipoProductoSchema, "params"),
    async (req, res) => {
        const { id } = req.params;
        try {
            const result = await tipo_producto_model.deleteOne({ _id: id });
            if (result.deletedCount === 0) {
                return res.status(404).json({ message: "Tipo de producto no encontrado" });
            }
            res.status(200).json({ message: "Tipo de producto eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
];