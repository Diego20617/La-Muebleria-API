import express from "express";
import {
    createResena,
    getAllResena,
    getResena,
    deleteResena,
} from "../controller/ResenaController.js";

const router = express.Router();

// Crear una reseña
router.post("/resena", createResena);

// Obtener todas las reseñas
router.get("/resena", getAllResena);

// Obtener una reseña por ID
router.get("/resena/:id", getResena);

// Eliminar una reseña
router.delete("/resena/:id", deleteResena);

export default router;
