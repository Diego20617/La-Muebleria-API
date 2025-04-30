import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import usuario_model from '../models/usuario_model.js';
import dotenv from 'dotenv';

dotenv.config();

const Login = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    // Buscar el usuario por correo y poblar los roles asociados
    const usuario = await usuario_model.findOne({ correo }).populate('id_rol');
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar la contraseña usando bcrypt
    const isMatch = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Extraer los nombres de los roles
    const roles = usuario.id_rol.map(rol => rol.rol);

    // Generar el token JWT
    const token = jwt.sign(
      {
        id: usuario._id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        roles,
      },
      process.env.JWT_SECRET,
      { expiresIn: '3h' }
    );

    // Respuesta exitosa
    res.status(200).json({
      message: 'Login exitoso',
      token,
    });
  } catch (error) {
    console.error('Error en el servidor:', error.message);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

export default Login;



