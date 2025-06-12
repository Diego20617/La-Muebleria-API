import Joi from "joi";

const id = Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
        "string.pattern.base": "El campo ID debe ser un ObjectId válido de 24 caracteres hexadecimales.",
        "any.required": "El campo ID es requerido.",
    });

const nombre = Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
        "string.base": "El nombre debe ser un texto.",
        "string.empty": "El nombre no puede estar vacío.",
        "string.min": "El nombre debe tener al menos 3 caracteres.",
        "string.max": "El nombre no puede exceder los 50 caracteres.",
        "any.required": "El nombre es un campo requerido.",
    });

const descripcion = Joi.string()
    .max(200)
    .messages({
        "string.base": "La descripción debe ser un texto.",
        "string.max": "La descripción no puede exceder los 200 caracteres.",
    });

const createTipoProductoSchema = Joi.object({
    nombre: nombre.required(),
    descripcion: descripcion.optional(),
});

const updateTipoProductoSchema = Joi.object({
    nombre: nombre.required(),
    descripcion: descripcion.optional(),
});

const getTipoProductoSchema = Joi.object({
    id: id.required(),
});

const deleteTipoProductoSchema = Joi.object({
    id: id.required(),
});

export {
    createTipoProductoSchema,
    getTipoProductoSchema,
    updateTipoProductoSchema,
    deleteTipoProductoSchema,
};