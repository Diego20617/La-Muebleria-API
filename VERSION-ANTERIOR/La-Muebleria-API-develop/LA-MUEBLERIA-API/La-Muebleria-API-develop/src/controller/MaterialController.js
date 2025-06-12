import material_model from "../models/material_model.js";
import { validatorHandler } from "../middleware/validator.handler.js";
import {
    createMaterialSchema,
    getMaterialSchema,
    deleteMaterialSchema,
} from "../validators/MaterialValidatorDTO.js";

// Crear material
export const createMaterial = [
    validatorHandler(createMaterialSchema, "body"),
    async (req, res) => {
        const material = new material_model(req.body);
        try {
            const data = await material.save();
            res.status(201).json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
];

// Obtener todos los materiales
export const getAllMaterials = async (req, res) => {
    try {
        const data = await material_model.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener material por ID
export const getMaterial = [
    validatorHandler(getMaterialSchema, "params"),
    async (req, res) => {
        const { id } = req.params;
        try {
            const material = await material_model.findById(id);
            if (!material) {
                return res.status(404).json({ message: "Material no encontrado" });
            }
            res.json(material);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
];

// Eliminar material
export const deleteMaterial = [
    validatorHandler(deleteMaterialSchema, "params"),
    async (req, res) => {
        const { id } = req.params;
        try {
            const result = await material_model.deleteOne({ _id: id });
            if (result.deletedCount === 0) {
                return res.status(404).json({ message: "Material no encontrado" });
            }
            res.status(200).json({ message: "Material eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
];