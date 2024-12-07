import Joi from "joi";

// Validaciones
const nombre = Joi.string().min(3).max(100).required();
const precio = Joi.number().min(0).required();
const descripcion = Joi.string().max(500);
const tipo_producto_id = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required();

// Schemas de validación para productos
const createProductoSchema = Joi.object({
    nombre,
    precio,
    descripcion,
    tipo_producto_id,
});

const updateProductoSchema = Joi.object({
    nombre,
    precio,
    descripcion,
    tipo_producto_id,
});

const getProductoSchema = Joi.object({
    id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
});

const deleteProductoSchema = Joi.object({
    id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
});

export {
    createProductoSchema,
    updateProductoSchema,
    getProductoSchema,
    deleteProductoSchema
};
