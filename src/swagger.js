import swaggerJSDOC from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

//Configuracion
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API con conexión a MongoDB",
      version: "1.0.0",
      description: "Ejemplo conectándose a MongoDB y separando las rutas",
      contact: {
        name: "API Support",
        url: "",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Documentación de mi API Rest Collection User",
      },
    ],
  },
  apis: ["./src./routes/usuario.js"],
};





const swaggerSpec = swaggerJSDOC(options);

export const swaggerJSDOCs = (app, port) => {
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
  console.log(
    `Version No 1 de la documentación estará disponible en http://localhost:${port}/api-docs`
  );
};
