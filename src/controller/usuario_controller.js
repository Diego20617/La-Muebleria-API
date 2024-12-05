import usuario_model from "../models/usuario_model.js";
import { validatorHandler} from "../middleware/validator.handler.js";
import bcrypt from 'bcryptjs'; 
import {
  createUsuarioSchema,
  getUsuarioSchema,
  updateUsuarioSchema,
  deleteUsuarioSchema,
} from "../validators/usuarioValidatorDTO.js";


//1. res.send("Esta ruta esta pensada para crear un usuario nuevo");
export const createUsuario = [
  validatorHandler(createUsuarioSchema, "body"),
  async (req, res) => {
    const usuario = new usuario_model(req.body);
    await usuario
      .save()
      .then((data) => res.status(201).json(data)) // Cambio el código de estado a 201 para indicar que se creó un nuevo recurso
      .catch((error) => res.status(500).json({ message: error.message })); // Asegúrate de enviar `error.message` para obtener un mensaje más claro
  },
];



//2.Obtener
export const getUsuario = (req, resp) => {
    usuario_model
        .find() //Metodo para buscar todos los docs de una coleccion
        .then((data) => resp.json(data))
        .catch((error) => resp.json({ message: error }));
};

//3.Obtener por id
export const getAllUsuario = [
  validatorHandler(getUsuarioSchema, "params"),
  async (req, resp) => {
    const { id } = req.params;
    try {
      //Metodo usado para buscar un documento de una coleccion
      const usuario = await usuario_model.findById(id);
      if (!usuario) {
        return resp.status(404).json({
          message: "Usuario no encontrado",
        });
      }
      resp.json(usuario);
    } catch (error) {
      resp.status(500).json({
        message: error.message,
      });
    }
  },
];

export const getAllUusarioWithRol = [
  validatorHandler(getUsuarioSchema, "params"),
  async (req, resp) => {
    const { id } = req.params;
    try {
      const usuario = await usuario_model.findById(id).populate("rol"); // Usar populate para incluir las categorías relacionadas
      if (!usuario) {
        return resp.status(404).json({ message: "Uusario no encontrado" });
      }
      resp.json(usuario);
    } catch (error) {
      resp.status(500).json({ message: error.message });
    }
  },
];



// 4. Actualizar
export const updateUsuario = [
  validatorHandler(getUsuarioSchema, "params"),
  validatorHandler(updateUsuarioSchema, "body"),
  async (req, resp) => {
    const { id } = req.params;
    const { nombres, apellidos, correo, num_doc, contraseña, id_rol } = req.body;

    try {
      const currentUsuario = await usuario_model.findById(id);

      if (!currentUsuario) {
        return resp.status(404).json({ message: "Usuario no encontrado" });
      }

      // Si la contraseña se ha cambiado, hacer el hash de la nueva contraseña
      let hashedPassword = currentUsuario.contraseña;
      if (contraseña) {
        const salt = await bcrypt.genSalt(10);  // Generar un salt con bcrypt
        hashedPassword = await bcrypt.hash(contraseña, salt);  // Hacer el hash de la nueva contraseña
      }

      // Si no se proporciona id_rol en la solicitud, mantener el id_rol actual
      const updateUsuario = id_rol !== undefined ? id_rol : currentUsuario.id_rol;

      // Actualizar el usuario en la base de datos
      const usuarioUpdate = await usuario_model.updateOne(
        { _id: id },
        {
          $set: {
            nombres,
            apellidos,
            correo,
            num_doc,
            contraseña: hashedPassword, // Actualizar la contraseña hasheada
            id_rol: updateUsuario,
          },
        }
      );

      // Verificar si se encontró el usuario y si se realizaron cambios
      if (usuarioUpdate.matchedCount === 0) {
        return resp.status(404).json({ message: "Usuario no encontrado" });
      }

      if (usuarioUpdate.modifiedCount === 0) {
        return resp.status(400).json({ message: "No se realizaron cambios en el usuario" });
      }

      resp.status(200).json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
      resp.status(500).json({ message: error.message });
    }
  },
];


//5.Borrar
export const deleteUsuario = [
  validatorHandler(deleteUsuarioSchema, "params"),

  async (req, resp) => {
    const { id } = req.params;
    try {
      const result = await usuario_model.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        return resp.status(404).json({ message: "Usuario no encontrado" });
      }
      return resp.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      return resp.status(500).json({ message: error.message });
    }
  },
];
