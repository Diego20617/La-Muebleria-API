import userSchema from "../models/tip_doc_model.js";
//1.Crear
const postTipDoc = (req, res) => {
    //res.send("Esta ruta esta pensada para crear un usuario nuevo");
    const user = userSchema(req.body);
    user
        .save()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
};

//2.Obtener
const getTipDoc = (req, resp) => {
    userSchema
        .find() //Metodo para buscar todos los docs de una coleccion
        .then((data) => resp.json(data))
        .catch((error) => resp.json({ message: error }));
};

//3.Obtener por id
const get2TipDoc = (req, resp) => {
    const { id } = req.params;
    userSchema
        .findById(id) //Metodo usado para buscar un documento de una coleccion
        .then((data) => resp.json(data))
        .catch((error) => res.json({ message: error }));
};

//4.Actualizar
const putTipDoc = (req, resp) => {
    const { id } = req.params;
    const { tip_doc } = req.body;
    userSchema
        .updateOne({ _id: id }, { $set: { nombre, edad, genero } })
        .then((data) => resp.json(data))
        .catch((error) => resp.json({ message: error }));
};

//5.Borrar
const deleteTipDoc = (req, resp) => {
    const { id } = req.params;
    userSchema
        .deleteOne({ _id: id })
        .then((data) => resp.json(data))
        .catch((error) => resp.json({ message: error }));
};

export{deleteTipDoc};
export{putTipDoc};
export{get2TipDoc};
export{getTipDoc};
export{postTipDoc};