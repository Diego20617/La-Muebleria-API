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

const estado = Joi.string()
  .min(3)
  .max(90)
  .required()
  .pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/)
  .messages({
    "string.base": "El estado debe ser un texto",
    "string.empty": "El estado no puede estar vacío.",
    "string.min": "El estado debe tener al menos 3 caracteres.",
    "string.max": "El estado no puede exceder los 90 caracteres.",
    "string.pattern.base": "El estado solo puede contener letras y espacios.",
    "any.required": "El estado es un campo requerido",
  });

//Ahora crearemos las validaciones para los métodos de la lógica


const createEstadoSchema = Joi.object({
  estado: estado.required(),
});

const updateEstadoSchema = Joi.object({
  estado: estado.required(),
});

const getEstadoSchema = Joi.object({
  id: id.required(),
});

const deleteEstadoSchema = Joi.object({
  id: id.required(),
});

export { createEstadoSchema, getEstadoSchema, updateEstadoSchema, deleteEstadoSchema };
