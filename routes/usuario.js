import express from "express";
import { deleteUsuario, putUsuario , get2Usuario, getUsuario , postUsuario } from '../controller/usuario_controller'

const router = express.Router();

//Creamos el ler endpoint
router.post("/usuario", postUsuario);

//2.Creamos la ruta para obtener todos los documentos de mi bdd en la colection users
router.get("/usuario", getUsuario);

// 3.Creamos la ruta para consultar un documento de mi bdd en la coleccion users
router.get("/usuario/:id", get2Usuario);

// 4.Creamos la ruta para actualizar un documento en la coleccion users
router.put("/usuario/:id", putUsuario);

// 5.Creamos la ruta para borrar un documento de mi bdd en la coleccion users
router.delete("/usuario/:id", deleteUsuario);

export default router;