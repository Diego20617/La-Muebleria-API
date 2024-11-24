import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { port } from "./config/conexion.js";
import usuarioRoutes from "./routes/usuario.js";
import tip_docRoutes from "./routes/tip_doc.js";
import estadoRoutes from "./routes/estado.js";
import rolRoutes from "./routes/rol.js";
import pedidoRoutes from "./routes/pedido.js";
import direccionRoutes from "./routes/direccion.js";
import { swaggerJSDOCs } from "./swagger.js";

const app = express();
const corsOptions = {
  // origin: "http://localhost:5173",
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 200,
};
app.use(express.json());
app.use(cors(corsOptions));

// middelware para incorporar como prefijo la silaba "/api" a cada endpoint
app.use("/api", usuarioRoutes);
app.use("/api", tip_docRoutes);
app.use("/api", estadoRoutes);
app.use("/api", rolRoutes);
app.use("/api", pedidoRoutes);
app.use("/api", direccionRoutes);
// Middleware para manejar datos URL-encoded
app.use(bodyParser.urlencoded({ extended: true }));

// const clientOptions = {
// serverApi : {
//   version : "1",
//   strict : true,
//   deprecationErrors: true,
// },

//Ruta base del APIWEB, nuestro endpoint base
app.get("/", (req, res) => {
  res.send("<h1>Bienvenido a mi API-WEB</h1>");
});

app.listen(port, () => {
  console.log(
    `Se inicio el servidos, y esta eschuchando por el puerto ${port}`
  );
  swaggerJSDOCs(app, 3005);
});
