import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { port } from "./config/conexion.js";
import usuarioRoutes from "./routess/usuario.js";
import tip_docRoutes from "./routess/tip_doc.js";
import estadoRoutes from "./routess/estado.js";
import rolRoutes from "./routess/rol.js";
import pedidoRoutes from "./routess/pedido.js";
import direccionRoutes from "./routess/direccion.js";
import productoRoutes from "./routess/producto_routes.js";
import inventarioRoutes from "./routess/InventarioRoutes.js";
import ResenaRoutes from "./routess/ResenaRoutes.js";
import UsuarioConProductoRoutes from "./routess/UsuarioConProductoRoutes.js";
import MaterialRoutes from "./routess/MaterialRoutes.js";
import tipo_producto_routes from "./routess/tipo_producto_routes.js"
import { swaggerUI, swaggerJSDOCs, swaggerSpec } from "./config/swagger.js";

const app = express();
const corsOptions = {
  // origin: "http://localhost:5173",
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 200,
};
app.use(express.json());
app.use(cors(corsOptions));

// Middleware para incluir la documentación de Swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// middelware para incorporar como prefijo la silaba "/api" a cada endpoint
app.use("/api", usuarioRoutes);
app.use("/api", tip_docRoutes);
app.use("/api", estadoRoutes);
app.use("/api", rolRoutes);
app.use("/api", pedidoRoutes);
app.use("/api", direccionRoutes);
app.use("/api", productoRoutes);
app.use("/api", inventarioRoutes);
app.use("/api", ResenaRoutes);
app.use("/api", UsuarioConProductoRoutes);
app.use("/api", MaterialRoutes);
app.use("/api", tipo_producto_routes);


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