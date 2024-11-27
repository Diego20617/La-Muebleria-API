import express from "express";
import {
    createProducto,
    getProducto,
    getAllProducto,
    getAllProductoWithTipProducto,
    updateProducto,
    deleteProducto
} from "../controller/producto_controller.js"

import { validatorHandler } from "../middleware/validator.handler.js";
import {
    createProductoSchema,
    getProductoSchema,
    updateProductoSchema,
    deleteProductoSchema,
} from "../validators/ProductoValidatorDTO.js";

const router = express.Router();

// Ruta para crear un producto
router.post(
    "/producto",
    validatorHandler(createProductoSchema, "body"),
    createProducto
);

// Ruta para obtener todos los productos
router.get("/producto", getProducto);

// Ruta para obtener un producto por ID
router.get(
    "/producto/:id",
    validatorHandler(getProductoSchema, "params"),
    getAllProducto
);

// Ruta para obtener un producto por ID, incluyendo el tipo de producto
router.get(
    "/producto/withTipoProducto/:id",
    validatorHandler(getProductoSchema, "params"),
    getAllProductoWithTipProducto
);

// Ruta para actualizar un producto por ID
router.put(
    "/producto/:id",
    validatorHandler(getProductoSchema, "params"),
    validatorHandler(updateProductoSchema, "body"),
    updateProducto
);

// Ruta para eliminar un producto por ID
router.delete(
    "/producto/:id",
    validatorHandler(deleteProductoSchema, "params"),
    deleteProducto
);

export default router;
