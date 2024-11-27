import Joi from "joi";

export const createUsuarioConProductoSchema = Joi.object({
    id_cliente: Joi.string().required().description("ID del cliente"),
    id_producto: Joi.string().required().description("ID del producto"),
});

export const getUsuarioConProductoSchema = Joi.object({
    id: Joi.string().required().description("ID del registro"),
});

export const deleteUsuarioConProductoSchema = Joi.object({
    id: Joi.string().required().description("ID del registro"),
});