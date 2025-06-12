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

const rol = Joi.string()
  .min(1)
  .max(90)
  .required()
  .pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/)
  .messages({
    "string.base": "El rol debe ser un texto",
    "string.empty": "El rol no puede estar vacío.",
    "string.min": "El rol debe tener al menos 3 caracteres.",
    "string.max": "El rol no puede exceder los 90 caracteres.",
    "string.pattern.base": "El rol solo puede contener letras y espacios.",
    "any.required": "El rol es un campo requerido",
  });

  const id_estado = Joi.array()
  .items(
    Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)) // Validación de un array de ObjectId (24 caracteres hexadecimales)
  .required()
  .messages({
    "array.base": "id_estado debe ser un array",
    "string.pattern.base":
      "Cada id_estado debe ser un ID de MongoDB válido (24 caracteres hexadecimales)",
  });


//Ahora crearemos las validaciones para los métodos de la lógica


const createRolSchema = Joi.object({
  rol: rol.required(),
  id_estado: id_estado.required(),
});

const updateRolSchema = Joi.object({
  rol: rol.required(),
  id_estado: id_estado.required(),
});

const getRolSchema = Joi.object({
  id: id.required(),
});

const deleteRolSchema = Joi.object({
  id: id.required(),
});

export { createRolSchema, getRolSchema, updateRolSchema, deleteRolSchema };
