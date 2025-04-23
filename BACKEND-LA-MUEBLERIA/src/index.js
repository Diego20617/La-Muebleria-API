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
import productoRoutes from "./routess/Producto_routes.js";
import inventarioRoutes from "./routess/InventarioRoutes.js";
import ResenaRoutes from "./routess/ResenaRoutes.js";
import UsuarioConProductoRoutes from "./routess/UsuarioConProductoRoutes.js";
import MaterialRoutes from "./routess/MaterialRoutes.js";
import tipo_producto_routes from "./routess/tipo_producto_routes.js";
import autenticationRouter from "./routess/autenticationRoutes.js"
import { swaggerUI, swaggerJSDOCs, swaggerSpec } from "./config/swagger.js";

const app = express();
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 200,
};
app.use(express.json());
app.use(cors(corsOptions));

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

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
app.use('/api/autenticacion', autenticationRouter);

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("<h1>Bienvenido a mi API-WEB</h1>");
});

// ÚNICO CAMBIO REALIZADO (2 modificaciones en esta parte):
app.listen(port, '0.0.0.0', () => {
  console.log(`Se inicio el servidos, y esta eschuchando por el puerto ${port}`);
  swaggerJSDOCs(app, port); // Cambiado 3005 por port
});
