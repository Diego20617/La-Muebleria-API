import Joi from "joi";

//Creamos las validaciones para cada campo
const id = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .required()
  .messages({
    "string.pattern.base":
      "El campo ID debe ser un ObjectId válido de 24 caracteres hexadecimales.",
    "any.required": "El campo ID es requerido.",
  });

const cant_productos = Joi.string()
  .min(1)
  .max(90)
  .required()
  .pattern(/^[A-Za-z0-9áéíóúÁÉÍÓÚñÑ\s,.\-#/]+$/)
  .messages({
    "string.base": "El pedido debe ser un texto",
    "string.empty": "El pedido no puede estar vacío.",
    "string.min": "El producto debe contener por lo menos un caracter.",
    "string.max": "El pedido no puede exceder los 90 caracteres.",
    "string.pattern.base": "El pedido solo puede contener letras y espacios.",
    "any.required": "El pedido es un campo requerido",
  });

  const id_direccion = Joi.array()
  .items(
    Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)) // Validación de un array de ObjectId (24 caracteres hexadecimales)
  .optional()
  .messages({
    "array.base": "id_direccion debe ser un string",
    "string.pattern.base":
      "Cada id_direccion debe ser un ID de MongoDB válido (24 caracteres hexadecimales)",
  });


//Ahora crearemos las validaciones para los métodos de la lógica


const createPedidoSchema = Joi.object({
  cant_productos: cant_productos.required(),
  id_direccion: id_direccion.optional(),
});

const updatePedidoSchema = Joi.object({
  cant_productos: cant_productos.required(),
  id_direccion: id_direccion.optional(),
});

const getPedidoSchema = Joi.object({
  id: id.required(),
});

const deletePedidoSchema = Joi.object({
  id: id.required(),
});

export { createPedidoSchema, getPedidoSchema, updatePedidoSchema, deletePedidoSchema };
