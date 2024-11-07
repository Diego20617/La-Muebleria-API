import express from "express"
import {updateTipoProducto, eraseTipoProducto, getAllTipoProducto, getTipoProducto, createTipoProducto} from '../controller/TipoProducto.js'

const router = express.Router();

//1
router.post("/procesos",createTipoProducto );
//2
router.get("/procesos/:id",getAllTipoProducto );
//3
router.get("/procesos/:id",getTipoProducto );
//4
router.delete("/procesos/:id",eraseTipoProducto );
//5
router.put("/procesos/:id",updateTipoProducto );

export default router;