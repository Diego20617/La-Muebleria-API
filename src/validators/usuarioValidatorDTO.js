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

const nombres = Joi.string()
  .min(3)
  .max(90)
  .required()
  .pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/)
  .messages({
    "string.base": "El nombre debe ser un texto",
    "string.empty": "El nombre no puede estar vacío.",
    "string.min": "El nombre debe tener al menos 3 caracteres.",
    "string.max": "El nombre no puede exceder los 90 caracteres.",
    "string.pattern.base": "El nombre solo puede contener letras y espacios.",
    "any.required": "Los nombres son un campo requerido",
  });

  const apellidos = Joi.string()
  .min(3)
  .max(90)
  .required()
  .pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/)
  .messages({
    "string.base": "El nombre debe ser un texto",
    "string.empty": "El nombre no puede estar vacío.",
    "string.min": "El nombre debe tener al menos 3 caracteres.",
    "string.max": "El nombre no puede exceder los 90 caracteres.",
    "string.pattern.base": "El nombre solo puede contener letras y espacios.",
    "any.required": "Los apellidos un campo requerido",
  });

const correo = Joi.string() // Validar que sea de tipo string
  .min(3)
  .max(90)
  .email()
  .required()
  .messages({
    "string.min": "El correo debe contener @example.com.",
    "string.max": "El correo no puede exceder los 90 caracteres.",
    "any.required": "El correo es un campo requerido",
  });

const num_doc = Joi.string()
.min(10)
.required()
.max(22)
.messages({
  "number.base": "El numero de documento debe ser un número.",
  "number.integer": "El numero de documento no puede contener decimales",
  "number.min": "El nuumero de documento debe ser mayor o igual a 1.",
  "number.max": "El numero de documento no puede exceder 22.",
  "any.required": "El num_doc es un campo requerido",
});

const contraseña = Joi.string() // Validar que sea de tipo string
  .min(3)
  .max(90)
  .alphanum()
  .required()
  .messages({
    "string.min": "La contraseña debe tener por lo menos 3 caracteres",
    "string.max": "La contraseña no puede exceder los 90 caracteres.",
    "any.required": "La contraseña es un campo requerido",
  });

//Ahora crearemos las validaciones para los métodos de la lógica

const createUsuarioSchema = Joi.object({
  nombres: nombres.required(),
  apellidos: apellidos.required(),
  correo: correo.required(),
  num_doc: num_doc.required(),
  contraseña: contraseña.required(),
});

const updateUsuarioSchema = Joi.object({
  nombres: nombres.required(),
  apellidos: apellidos.required(),
  correo: correo.required(),
  num_doc: num_doc.required(),
  contraseña: contraseña.required(),
});

const getUsuarioSchema = Joi.object({
  id: id.required(),
});

const deleteUsuarioSchema = Joi.object({
  id: id.required(),
});

export {
  createUsuarioSchema,
  getUsuarioSchema,
  updateUsuarioSchema,
  deleteUsuarioSchema,
};
