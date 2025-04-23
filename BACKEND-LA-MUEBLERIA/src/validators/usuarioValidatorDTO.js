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
  .max(30)
  .required()
  .pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/)
  .messages({
    "string.base": "El nombre debe ser un texto",
    "string.empty": "El nombre no puede estar vacío.",
    "string.min": "El nombre debe tener al menos 3 caracteres.",
    "string.max": "El nombre no puede exceder los 30 caracteres.",
    "string.pattern.base": "El nombre solo puede contener letras y espacios.",
    "any.required": "Los nombres son un campo requerido",
  });

const apellidos = Joi.string()
  .min(3)
  .max(30)
  .required()
  .pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/)
  .messages({
    "string.base": "El nombre debe ser un texto",
    "string.empty": "El nombre no puede estar vacío.",
    "string.min": "El nombre debe tener al menos 3 caracteres.",
    "string.max": "El nombre no puede exceder los 30 caracteres.",
    "string.pattern.base": "El nombre solo puede contener letras y espacios.",
    "any.required": "Los apellidos un campo requerido",
  });

const correo = Joi.string() // Validar que sea de tipo string
  .min(3)
  .max(30)
  .email()
  .required()
  .messages({
    "string.min": "El correo debe contener @example.com.",
    "string.max": "El correo no puede exceder los 30 caracteres.",
    "any.required": "El correo es un campo requerido",
  });

// Corregido para ser coherente con el modelo que lo define como Number
const num_doc = Joi.string()
  .min(10)
  .max(10)
  .pattern(/^\d+$/) // Solo dígitos
  .required()
  .messages({
    "string.base": "El numero de documento debe ser un texto numérico.",
    "string.empty": "El numero de documento no puede estar vacío.",
    "string.min": "El numero de documento debe tener al menos 10 caracteres.",
    "string.max": "El numero de documento no puede exceder 10 caracteres.",
    "string.pattern.base": "El numero de documento solo puede contener dígitos.",
    "any.required": "El num_doc es un campo requerido",
  });

// Corregido para permitir caracteres especiales sin contradecirse
const contraseña = Joi.string() // Validar que sea de tipo string
  .min(3)
  .max(20)
  .pattern(/^[A-Za-z0-9!@#$%^&*()_+\-=]+$/) // Permite alfanuméricos y caracteres especiales
  .required()
  .messages({
    "string.min": "La contraseña debe tener por lo menos 3 caracteres",
    "string.max": "La contraseña no puede exceder los 20 caracteres.",
    "string.pattern.base": "La contraseña solo puede contener letras, números y caracteres especiales comunes.",
    "any.required": "La contraseña es un campo requerido",
  });

const id_rol = Joi.array()
  .items(
    Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)) // Validación de un array de ObjectId (24 caracteres hexadecimales)
  .optional()
  .messages({
    "array.base": "id_rol debe ser un array",
    "string.pattern.base":
      "Cada id_rol debe ser un ID de MongoDB válido (24 caracteres hexadecimales)",
  });

//Ahora crearemos las validaciones para los métodos de la lógica

const createUsuarioSchema = Joi.object({
  nombres: nombres.required(),
  apellidos: apellidos.required(),
  correo: correo.required(),
  num_doc: num_doc.required(),
  contraseña: contraseña.required(),
  id_rol: id_rol.required(),
});

const updateUsuarioSchema = Joi.object({
  nombres: nombres.required(),
  apellidos: apellidos.required(),
  correo: correo.required(),
  num_doc: num_doc.required(),
  contraseña: contraseña.required(),
  id_rol: id_rol.required(),
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
