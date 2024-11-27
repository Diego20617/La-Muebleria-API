import express from "express";
import {
    createUsuarioConProducto,
    getAllUsuarioConProducto,
    getUsuarioConProducto,
    deleteUsuarioConProducto,
} from "../controller/UsuarioConProductoController.js";

const router = express.Router();

// Rutas para UsuarioConProducto
router.post("/usuario-con-producto", createUsuarioConProducto); // Crear un usuario con producto
router.get("/usuario-con-producto", getAllUsuarioConProducto); // Obtener todos los usuarios con productos
router.get("/usuario-con-producto/:id", getUsuarioConProducto); // Obtener un usuario con producto por ID
router.delete("/usuario-con-producto/:id", deleteUsuarioConProducto); // Eliminar un usuario con producto

export default router;
