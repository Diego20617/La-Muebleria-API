import express from "express";
import userSchema from "../models/tipoproducto.js";


const router = express.Router();

//Creamos el ler endpoint
router.post("/users", (req, res) => {
    //res.send("Esta ruta esta pensada para crear un usuario nuevo");
    const user = userSchema(req.body);
    user
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error}));
});

//2.Creamos la ruta para obtener todos los documentos de mi bdd en la colection users
router.get("/users", (req, resp) => {
    userSchema
    .find() //Metodo para buscar todos los docs de una coleccion
    .then((data) => resp.json(data))
    .catch((error) => resp.json({ message: error })); 
});

// 3.Creamos la ruta para consultar un documento de mi bdd en la coleccion users
router.get("/users/:id", (req,resp) => {
    const {id} = req.params;
    userSchema
    .findById(id) //Metodo usado para buscar un documento de una coleccion
    .then((data) => resp.json(data))
    .catch((error) => res.json({ message: error }));
});

// 4.Creamos la ruta para actualizar un documento en la coleccion users
router.put("/users/:id", (req,resp) => {
    const {id} = req.params;
    const { nombre, edad, genero } = req.body;
    userSchema
    .updateOne({ _id: id }, { $set: { nombre, edad, genero  } })
    .then((data) => resp.json(data))
    .catch((error) => resp.json({ message: error }));
});

// 5.Creamos la ruta para borrar un documento de mi bdd en la coleccion users
router.delete("/users/:id", (req,resp) => {
    const {id} = req.params;
    userSchema
    .deleteOne({ _id: id })
    .then((data) => resp.json(data))
    .catch((error) => resp.json({ message: error }));
});

export default router;
