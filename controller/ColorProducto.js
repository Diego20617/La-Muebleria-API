import userSchema from "../models/ColorProducto.js";


const createColorProducto = (req, res) => {
    //res.send("Esta ruta esta pensada para crear un usuario nuevo");
    const user = userSchema(req.body);
    user
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error}));
};


const getColorProducto = (req, resp) => {
    userSchema
    .find() //Metodo para buscar todos los docs de una coleccion
    .then((data) => resp.json(data))
    .catch((error) => resp.json({ message: error })); 
};

const getAllColorProducto = (req,resp) => {
    const {id} = req.params;
    userSchema
    .findById(id) //Metodo usado para buscar un documento de una coleccion
    .then((data) => resp.json(data))
    .catch((error) => res.json({ message: error }));
};

const updateColorProducto = (req,resp) => {
    const {id} = req.params;
    const { nombre, edad, genero } = req.body;
    userSchema
    .updateOne({ _id: id }, { $set: { nombre, edad, genero  } })
    .then((data) => resp.json(data))
    .catch((error) => resp.json({ message: error }));
};

const eraseColorProducto = (req,resp) => {
    const {id} = req.params;
    userSchema
    .deleteOne({ _id: id })
    .then((data) => resp.json(data))
    .catch((error) => resp.json({ message: error }));
};

export {updateColorProducto};
export {eraseColorProducto};
export {getAllColorProducto};
export {getColorProducto};
export {createColorProducto};