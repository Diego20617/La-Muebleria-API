import express from "express";
import {
    createUsuarioConProducto,
    getAllUsuarioConProducto,
    getUsuarioConProductoById,
    deleteUsuarioConProducto,
} from "../controller/UsuarioConProductoController.js";

const router = express.Router();

router.post("/", createUsuarioConProducto); // Crear una relación
router.get("/", getAllUsuarioConProducto); // Obtener todas las relaciones
router.get("/:id", getUsuarioConProductoById); // Obtener relación por ID
router.delete("/:id", deleteUsuarioConProducto); // Eliminar relación por ID

export default router;
