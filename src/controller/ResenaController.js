import resena_model from "../models/resena_model.js";
import { validatorHandler } from "../middleware/validator.handler.js";
import {
    createResenaSchema,
    getResenaSchema,
    deleteResenaSchema,
} from "../validators/ResenaValidatorDTO.js";

// Crear una reseña
export const createResena = [
    validatorHandler(createResenaSchema, "body"),
    async (req, res) => {
        const resena = new resena_model(req.body);
        try {
            const data = await resena.save();
            res.status(201).json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
];

// Obtener todas las reseñas
export const getAllResena = async (req, res) => {
    try {
        const data = await resena_model.find().populate("id_producto");
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener reseña por ID
export const getResena = [
    validatorHandler(getResenaSchema, "params"),
    async (req, res) => {
        const { id } = req.params;
        try {
            const resena = await resena_model.findById(id).populate("id_producto");
            if (!resena) {
                return res.status(404).json({ message: "Reseña no encontrada" });
            }
            res.json(resena);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
];

// Eliminar reseña
export const deleteResena = [
    validatorHandler(deleteResenaSchema, "params"),
    async (req, res) => {
        const { id } = req.params;
        try {
            const result = await resena_model.deleteOne({ _id: id });
            if (result.deletedCount === 0) {
                return res.status(404).json({ message: "Reseña no encontrada" });
            }
            res.status(200).json({ message: "Reseña eliminada correctamente" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
];
