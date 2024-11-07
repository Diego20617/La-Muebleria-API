import userSchema from "../models/Producto.js";


const createProducto = (req, res) => {
    //res.send("Esta ruta esta pensada para crear un usuario nuevo");
    const user = userSchema(req.body);
    user
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error}))
};


const getProducto = (req, resp) => {
    userSchema
    .find() //Metodo para buscar todos los docs de una coleccion
    .then((data) => resp.json(data))
    .catch((error) => resp.json({ message: error })); 
};

const getAllProducto = (req,resp) => {
    const {id} = req.params;
    userSchema
    .findById(id) //Metodo usado para buscar un documento de una coleccion
    .then((data) => resp.json(data))
    .catch((error) => res.json({ message: error }));
};

const updateProducto = (req,resp) => {
    const {id} = req.params;
    const { nombre, edad, genero } = req.body;
    userSchema
    .updateOne({ _id: id }, { $set: { nombre, edad, genero  } })
    .then((data) => resp.json(data))
    .catch((error) => resp.json({ message: error }));
};

const eraseProducto = (req,resp) => {
    const {id} = req.params;
    userSchema
    .deleteOne({ _id: id })
    .then((data) => resp.json(data))
    .catch((error) => resp.json({ message: error }));
};

export {updateProducto};
export {eraseProducto};
export {getAllProducto};
export {getProducto};
export {createProducto};