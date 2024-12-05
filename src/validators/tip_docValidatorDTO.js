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

const tip_doc = Joi.string()
  .min(2)
  .max(20)
  .required()
  .pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/)
  .messages({
    "string.base": "El tipo de documento debe ser un texto",
    "string.empty": "El tipo de documento no puede estar vacío.",
    "string.min": "El tipo de documento debe tener al menos 3 caracteres.",
    "string.max": "El tipo de documento no puede exceder los 90 caracteres.",
    "string.pattern.base": "El tipo de documento solo puede contener letras y espacios.",
    "any.required": "El tipo de documento es un campo requerido",
  });

  const id_usuario = Joi.array()
  .items(
    Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)) // Validación de un array de ObjectId (24 caracteres hexadecimales)
  .optional()
  .messages({
    "array.base": "id_cliente debe ser un array",
    "string.pattern.base":
      "Cada id_cliente debe ser un ID de MongoDB válido (24 caracteres hexadecimales)",
  });


//Ahora crearemos las validaciones para los métodos de la lógica


const createTip_docSchema = Joi.object({
  tip_doc: tip_doc.required(),
  id_usuario: id_usuario.optional(),
});

const updateTip_docSchema = Joi.object({
  tip_doc: tip_doc.required(),
  id_usuario: id_usuario.optional(),
});

const getTip_docSchema = Joi.object({
  id: id.required(),
});

const deleteTip_docSchema = Joi.object({
  id: id.required(),
});

export { createTip_docSchema, getTip_docSchema, updateTip_docSchema, deleteTip_docSchema };
