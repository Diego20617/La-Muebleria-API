import express from "express";
import {
    createInventario,
    getAllInventarios,
    getInventario,
    deleteInventario,
} from "../controller/InventarioController.js";

const router = express.Router();

// Crear un registro de inventario
router.post("/inventario", createInventario);

// Obtener todos los registros de inventario
router.get("/inventario", getAllInventarios);

// Obtener un registro de inventario por ID
router.get("/inventario/:id", getInventario);

// Eliminar un registro de inventario
router.delete("/inventario/:id", deleteInventario);

export default router;
