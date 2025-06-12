import Joi from "joi";

export const createResenaSchema = Joi.object({
    resena: Joi.string().max(45).required().description("Texto de la reseña"),
    id_producto: Joi.string().required().description("ID del producto asociado"),
});

export const getResenaSchema = Joi.object({
    id: Joi.string().required().description("ID de la reseña"),
});

export const deleteResenaSchema = Joi.object({
    id: Joi.string().required().description("ID de la reseña a eliminar"),
});
