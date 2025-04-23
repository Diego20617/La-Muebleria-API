import usuario_model from "../models/usuario_model.js";
import { validatorHandler} from "../middleware/validator.handler.js";
import bcrypt from 'bcryptjs'; 
import {
  createUsuarioSchema,
  getUsuarioSchema,
  updateUsuarioSchema,
  deleteUsuarioSchema,
} from "../validators/usuarioValidatorDTO.js";

const SALT_ROUNDS = 10;

export const createUsuario = [
  validatorHandler(createUsuarioSchema, "body"),
  async (req, res) => {
    try {
      const { nombres, apellidos, correo, num_doc, contraseña, id_rol } = req.body;

      // Verificar que la contraseña esté presente
      if (!contraseña) {
        return res.status(400).json({ message: "La contraseña es requerida" });
      }

      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(contraseña, SALT_ROUNDS);

      // Crear nuevo usuario
      let nuevoUsuario = new Usuario({
        nombres,
        apellidos,
        correo,
        num_doc,
        contraseña: hashedPassword, // Guardamos la contraseña hasheada
        id_rol,
      });

      // Guardar usuario en la base de datos
      await nuevoUsuario.save();

      res.status(201).json({
        message: "Usuario creado exitosamente",
        data: nuevoUsuario, // Opcionalmente puedes devolver el usuario creado
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error al crear el usuario:"});
    }
  },
];



// 2. Obtener todos los usuarios con el rol completo
export const getUsuario = async (req, resp) => {
  try {
    const usuarios = await usuario_model
      .find()
      .populate("id_rol", "rol") // Traer solo el campo 'nombre' del rol
      .lean(); // Convierte el resultado en un objeto JavaScript puro

    // Transformar el campo 'id_rol' para que sea un string con el nombre del rol
    const usuariosConRolNombre = usuarios.map((usuario) => {
      return {
        ...usuario,
        id_rol: usuario.id_rol ? usuario.id_rol.rol : null, // Extraer solo el nombre
      };
    });

    resp.status(200).json(usuariosConRolNombre);
  } catch (error) {
    resp.status(500).json({ message: error.message });
  }
};


//3.Obtener por id
export const getAllUsuario = [
  validatorHandler(getUsuarioSchema, "params"),
  async (req, resp) => {
    const { id } = req.params;
    try {
      //Metodo usado para buscar un documento de una coleccion
      const usuario = await usuario_model
      .findById(id)
      .populate("id_rol", "rol") //Traera el nombre del rol
      .lean(); //convierte el objeto de json a javascript 
      if (!usuario) {
        return resp.status(404).json({
          message: "Usuario no encontrado",
        });
      }
  // Ajustar el campo 'id_rol' para que sea un string
  usuario.id_rol = usuario.id_rol ? usuario.id_rol.rol : null;
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
      // Usar populate con el nombre correcto del campo 'id_rol'
      const usuario = await usuario_model.findById(id).populate("id_rol", "rol"); 
      if (!usuario) {
        return resp.status(404).json({ message: "Usuario no encontrado" });
      }
      resp.json(usuario);
    } catch (error) {
      resp.status(500).json({ message: error.message });
    }
  },
];


// 4. Actualizar usuario y devolver el rol completo
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
        const salt = await bcrypt.genSalt(10); // Generar un salt con bcrypt
        hashedPassword = await bcrypt.hash(contraseña, salt); // Hacer el hash de la nueva contraseña
      }

      // Si no se proporciona id_rol en la solicitud, mantener el id_rol actual
      const updatedRol = id_rol !== undefined ? id_rol : currentUsuario.id_rol;

      // Actualizar el usuario en la base de datos
      await usuario_model.updateOne(
        { _id: id },
        {
          $set: {
            nombres,
            apellidos,
            correo,
            num_doc,
            contraseña: hashedPassword, // Actualizar la contraseña hasheada
            id_rol: updatedRol,
          },
        }
      );

      // Obtener el usuario actualizado y popular solo el nombre del rol
      const usuarioActualizado = await usuario_model
        .findById(id)
        .populate("id_rol", "rol") // Traer solo el campo 'nombre' del rol
        .lean(); // Convertir el documento en un objeto plano

      // Si el rol existe, reemplazar el id_rol con solo el nombre del rol
      if (usuarioActualizado.id_rol) {
        usuarioActualizado.id_rol = usuarioActualizado.id_rol.rol;
      }

      resp.status(200).json({
        message: "Usuario actualizado correctamente",
        data: usuarioActualizado,
      });
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
