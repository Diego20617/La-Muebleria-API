import userSchema from "../models/estado_model.js";
//1.Crear
const postEstado = (req, res) => {
    //res.send("Esta ruta esta pensada para crear un usuario nuevo");
    const user = userSchema(req.body);
    user
        .save()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
};

//2.Obtener
const getEstado = (req, resp) => {
    userSchema
        .find() //Metodo para buscar todos los docs de una coleccion
        .then((data) => resp.json(data))
        .catch((error) => resp.json({ message: error }));
};

//3.Obtener por id
const get2Estado = (req, resp) => {
    const { id } = req.params;
    userSchema
        .findById(id) //Metodo usado para buscar un documento de una coleccion
        .then((data) => resp.json(data))
        .catch((error) => res.json({ message: error }));
};

//4.Actualizar
const putEstado = (req, resp) => {
    const { id } = req.params;
    const { tip_doc } = req.body;
    userSchema
        .updateOne({ _id: id }, { $set: { nombre, edad, genero } })
        .then((data) => resp.json(data))
        .catch((error) => resp.json({ message: error }));
};

//5.Borrar
const deleteEstado = (req, resp) => {
    const { id } = req.params;
    userSchema
        .deleteOne({ _id: id })
        .then((data) => resp.json(data))
        .catch((error) => resp.json({ message: error }));
};

export{deleteEstado};
export{putEstado};
export{get2Estado};
export{getEstado};
export{postEstado};