import express from "express";
import { deleteEstado, putEstado, get2Estado, getEstado, postEstado } from '../controller/estado_controller'

const router = express.Router();

//Creamos el ler endpoint
router.post("/usuario", postEstado);

//2.Creamos la ruta para obtener todos los documentos de mi bdd en la colection users
router.get("/usuario", getEstado);

// 3.Creamos la ruta para consultar un documento de mi bdd en la coleccion users
router.get("/usuario/:id", get2Estado);

// 4.Creamos la ruta para actualizar un documento en la coleccion users
router.put("/usuario/:id", putEstado);

// 5.Creamos la ruta para borrar un documento de mi bdd en la coleccion users
router.delete("/usuario/:id", deleteEstado);

export default router;