import jwt from 'jsonwebtoken';

// Middleware para verificar el JWT
const verifyJWT = (req, res, next) => {
    // Verificar token
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Acceso correcto a la variable de entorno
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Token no válido' });
    }
};

// Middleware para verificar los roles específicos
const verifyRole = (rolesPermitidos) => (req, res, next) => {
    const userRoles = req.user.rol; // Asegúrate de que `rol` sea un array
    const hasRole = userRoles.some(role => rolesPermitidos.includes(role));

    if (!hasRole) {
        return res.status(403).json({ message: 'Acceso denegado' }); // Cambié a 403 para un acceso prohibido
    }
    next();
};

export { verifyJWT, verifyRole };
