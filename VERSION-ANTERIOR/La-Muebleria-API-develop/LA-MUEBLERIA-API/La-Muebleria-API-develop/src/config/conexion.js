import mongoose from "mongoose";
import dotenv from "dotenv";
const port = process.env.PORT || 3005;
dotenv.config();

//Usamos el metodo para conectarnos a la BdD de mongoose
const clientOptions = {
    serverApi: {
      version: "1",
      strict: true,
      deprecationErrors: true,
    },
  };


mongoose
  .connect(process.env.MONGODB_URI, clientOptions)

.then(() => {
    console.log("Conectado a MONGOBD");
})
.catch((error) => {
    console.log(`Ocurrio el siguiente error al conectarse ${error.message}`);
});

export{port};