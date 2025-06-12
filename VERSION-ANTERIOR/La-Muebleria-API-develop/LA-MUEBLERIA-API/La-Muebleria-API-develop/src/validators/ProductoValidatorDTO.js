import Joi from "joi";

// Validaciones
const name = Joi.string().min(3).max(100).required();
const category = Joi.string().allow(''); // Permite string vacío
const price = Joi.string().required();
const stock = Joi.string().allow(''); // Permite string vacío
const description = Joi.string().max(500).allow(''); // Permite string vacío
const color = Joi.string().allow(''); // Permite string vacío
const height = Joi.string().allow(''); // Permite string vacío
const width = Joi.string().allow(''); // Permite string vacío
const depth = Joi.string().allow(''); // Permite string vacío
const imageUrl = Joi.string().allow(''); // Permite string vacío
const tipo_producto_id = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).allow(''); // Permite string vacío

// Schemas de validación para productos
const createProductoSchema = Joi.object({
    name: name,
    category: category,
    price: price,
    stock: stock,
    description: description,
    color: color,
    dimensions: Joi.object({
        height: height,
        width: width,
        depth: depth,
    }),
    imageUrl: imageUrl,
    tipo_producto_id: tipo_producto_id,
});

const updateProductoSchema = Joi.object({
    name: name,
    category: category,
    price: price,
    stock: stock,
    description: description,
    color: color,
    dimensions: Joi.object({
        height: height,
        width: width,
        depth: depth,
    }),
    imageUrl: imageUrl,
    tipo_producto_id: tipo_producto_id,
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
