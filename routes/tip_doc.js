import express from "express";
import { postTipDoc,getTipDoc ,get2TipDoc, putTipDoc, deleteTipDoc} from '../controller/tip_doc_controller'

const router = express.Router(); 

//Creamos el ler endpoint
router.post("/tip_doc", postTipDoc);

//2.Creamos la ruta para obtener todos los documentos de mi bdd en la colection users
router.get("/tip_doc", getTipDoc);

// 3.Creamos la ruta para consultar un documento de mi bdd en la coleccion users
router.get("/tip_doc/:id", get2TipDoc);

// 4.Creamos la ruta para actualizar un documento en la coleccion users
router.put("/tip_doc/:id", putTipDoc);

// 5.Creamos la ruta para borrar un documento de mi bdd en la coleccion users
router.delete("/tip_doc/:id", deleteTipDoc);

export default router;
