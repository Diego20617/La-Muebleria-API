import express from "express"
import {updateColorProducto, eraseColorProducto, getAllColorProducto, getColorProducto, createColorProducto} from '../controller/ColorProducto.js'

const router = express.Router();

//1
router.post("/procesos",createColorProducto );
//2
router.get("/procesos/:id",getAllColorProducto );
//3
router.get("/procesos/:id",getColorProducto );
//4
router.delete("/procesos/:id",eraseColorProducto );
//5
router.put("/procesos/:id",updateColorProducto );

export default router;