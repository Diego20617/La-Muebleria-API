import Joi from "joi";

export const createMaterialSchema = Joi.object({
    material: Joi.string().max(45).required().description("Nombre del material"),
});

export const getMaterialSchema = Joi.object({
    id: Joi.string().required().description("ID del material"),
});

export const deleteMaterialSchema = Joi.object({
    id: Joi.string().required().description("ID del material a eliminar"),
});