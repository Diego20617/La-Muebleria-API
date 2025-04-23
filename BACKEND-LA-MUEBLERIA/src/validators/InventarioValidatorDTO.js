import Joi from "joi";

export const createInventarioSchema = Joi.object({
    cantidad: Joi.string().max(45).required().description("Cantidad en inventario"),
    id_producto: Joi.string().required().description("ID del producto relacionado"),
    id_material: Joi.string().required().description("ID del material relacionado"),
});

export const getInventarioSchema = Joi.object({
    id: Joi.string().required().description("ID del inventario"),
});

export const deleteInventarioSchema = Joi.object({
    id: Joi.string().required().description("ID del inventario a eliminar"),
});
