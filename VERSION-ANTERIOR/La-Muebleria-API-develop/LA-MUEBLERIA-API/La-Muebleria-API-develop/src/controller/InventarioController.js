import inventario_model from "../models/inventario_model.js";
import { validatorHandler } from "../middleware/validator.handler.js";
import {
    createInventarioSchema,
    getInventarioSchema,
    deleteInventarioSchema,
} from "../validators/InventarioValidatorDTO.js";

// Crear inventario
export const createInventario = [
    validatorHandler(createInventarioSchema, "body"),
    async (req, res) => {
        const inventario = new inventario_model(req.body);
        try {
            const data = await inventario.save();
            res.status(201).json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
];

// Obtener todos los registros de inventario
export const getAllInventarios = async (req, res) => {
    try {
        const data = await inventario_model
            .find()
            .populate("id_producto", "producto") 
            .populate("id_material", "material"); 
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener inventario por ID
export const getInventario = [
    validatorHandler(getInventarioSchema, "params"),
    async (req, res) => {
        const { id } = req.params;
        try {
            const inventario = await inventario_model
                .findById(id)
                .populate("id_producto", "nombre")
                .populate("id_material", "material");
            if (!inventario) {
                return res.status(404).json({ message: "Inventario no encontrado" });
            }
            res.json(inventario);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
];

// Eliminar inventario
export const deleteInventario = [
    validatorHandler(deleteInventarioSchema, "params"),
    async (req, res) => {
        const { id } = req.params;
        try {
            const result = await inventario_model.deleteOne({ _id: id });
            if (result.deletedCount === 0) {
                return res.status(404).json({ message: "Inventario no encontrado" });
            }
            res.status(200).json({ message: "Inventario eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
];
