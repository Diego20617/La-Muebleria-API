import Joi from "joi";

export const createUsuarioConProductoSchema = Joi.object({
    id_usuario: Joi.string().required().description("ID del usuario"),
    id_producto: Joi.string().required().description("ID del producto"),
});

export const getUsuarioConProductoSchema = Joi.object({
    id: Joi.string().required().description("ID del registro"),
});

export const deleteUsuarioConProductoSchema = Joi.object({
    id: Joi.string().required().description("ID del registro"),
});
