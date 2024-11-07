import express from "express"
import {updateProducto, eraseProducto, getAllProducto, getProducto, createProducto} from '../controller/Producto.js'

const router = express.Router();

//1
router.post("/procesos",createProducto );
//2
router.get("/procesos/:id",getAllProducto );
//3
router.get("/procesos/:id",getProducto );
//4
router.delete("/procesos/:id",eraseProducto );
//5
router.put("/procesos/:id",updateProducto );

export default router;