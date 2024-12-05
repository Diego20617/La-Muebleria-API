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

const direccion = Joi.string()
  .min(3)
  .max(90)
  .required()
  .pattern(/^[A-Za-z0-9áéíóúÁÉÍÓÚñÑ\s,.\-#/]+$/)
  .messages({
    "string.base": "La direccion debe ser un texto",
    "string.empty": "La direccion no puede estar vacío.",
    "string.min": "La direccion debe tener al menos 3 caracteres.",
    "string.max": "La direccion no puede exceder los 90 caracteres.",
    "string.pattern.base": "La direccion solo puede contener letras y espacios.",
    "any.required": "La direccion es un campo requerido",
  });


//Ahora crearemos las validaciones para los métodos de la lógica


const createDireccionSchema = Joi.object({
  direccion: direccion.required(),
});

const updateDireccionSchema = Joi.object({
  direccion: direccion.required(),
});

const getDireccionSchema = Joi.object({
  id: id.required(),
});

const deleteDireccionSchema = Joi.object({
  id: id.required(),
});

export { createDireccionSchema, getDireccionSchema, updateDireccionSchema, deleteDireccionSchema };
