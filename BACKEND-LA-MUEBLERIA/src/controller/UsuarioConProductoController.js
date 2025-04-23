import usuarioConProducto_model from "../models/UsuarioConProducto_model.js";
import { validatorHandler } from "../middleware/validator.handler.js";
import {
    createUsuarioConProductoSchema,
    getUsuarioConProductoSchema,
    deleteUsuarioConProductoSchema,
} from "../validators/UsuarioConProductoValidatorDTO.js";

// Crear usuario con producto
export const createUsuarioConProducto = [
    validatorHandler(createUsuarioConProductoSchema, "body"),
    async (req, res) => {
        const usuarioConProducto = new usuarioConProducto_model(req.body);
        try {
            const data = await usuarioConProducto.save();
            res.status(201).json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
];

// Obtener todos los usuarios con productos
export const getAllUsuarioConProducto = async (req, res) => { // Nombre corregido aquí
    try {
        const data = await usuarioConProducto_model
            .find()
            .populate("id_usuario")
            .populate("id_producto");
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener usuario con producto por ID
export const getUsuarioConProducto = [
    validatorHandler(getUsuarioConProductoSchema, "params"),
    async (req, res) => {
        const { id } = req.params;
        try {
            const data = await usuarioConProducto_model
                .findById(id)
                .populate("id_cliente")
                .populate("id_producto");
            if (!data) {
                return res.status(404).json({ message: "Usuario con producto no encontrado" });
            }
            res.json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
];

// Eliminar usuario con producto
export const deleteUsuarioConProducto = [
    validatorHandler(deleteUsuarioConProductoSchema, "params"),
    async (req, res) => {
        const { id } = req.params;
        try {
            const result = await usuarioConProducto_model.deleteOne({ _id: id });
            if (result.deletedCount === 0) {
                return res.status(404).json({ message: "Usuario con producto no encontrado" });
            }
            res.status(200).json({ message: "Usuario con producto eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
];
