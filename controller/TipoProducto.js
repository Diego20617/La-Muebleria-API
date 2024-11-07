import userSchema from "../models/tipoproducto.js";


const createTipoProducto = (req, res) => {
    //res.send("Esta ruta esta pensada para crear un usuario nuevo");
    const user = userSchema(req.body);
    user
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error}));
};


const getTipoProducto = (req, resp) => {
    userSchema
    .find() //Metodo para buscar todos los docs de una coleccion
    .then((data) => resp.json(data))
    .catch((error) => resp.json({ message: error })); 
};

const getAllTipoProducto = (req,resp) => {
    const {id} = req.params;
    userSchema
    .findById(id) //Metodo usado para buscar un documento de una coleccion
    .then((data) => resp.json(data))
    .catch((error) => res.json({ message: error }));
};

const updateTipoProducto = (req,resp) => {
    const {id} = req.params;
    const { nombre, edad, genero } = req.body;
    userSchema
    .updateOne({ _id: id }, { $set: { nombre, edad, genero  } })
    .then((data) => resp.json(data))
    .catch((error) => resp.json({ message: error }));
};

const eraseTipoProducto = (req,resp) => {
    const {id} = req.params;
    userSchema
    .deleteOne({ _id: id })
    .then((data) => resp.json(data))
    .catch((error) => resp.json({ message: error }));
};

export {updateTipoProducto};
export {eraseTipoProducto};
export {getAllTipoProducto};
export {getTipoProducto};
export {createTipoProducto};