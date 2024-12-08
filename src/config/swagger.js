import swaggerJSDOC from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

// Configuración de Swagger
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
        url: "http://localhost:3005",
        description: "Documentación de mi API Rest",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
        },
      },
      schemas: {
        
        tip_doc: {
          type: "object",
          properties: {
            tip_doc: {
              type: "string",
              description: "Tipo de documento (por ejemplo, CC, TI)",
            },
            id_usuario: {
              type: "array",
              items: {
                type: "string",
                description: "IDs de usuarios relacionados",
              },
            },
          },
          required: ["tip_doc"],
          example: {
            tip_doc: "CC",
            id_usuario: ["123abc", "456def"],
          },
        },
      },
    },
    security:[
      {
        BearerAuth: [],
      },
    ],
  },
  apis: [
    "./src/routess/*.js" // Ruta de las definiciones de las rutas
  ],
};

const swaggerSpec = swaggerJSDOC(options);

// Función para integrar Swagger
export const swaggerJSDOCs = (app, port) => { 
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec)); 
  app.get("/api-docs.json", (req, res) => { 
    res.setHeader("Content-Type", "application/json"); 
    res.send(swaggerSpec); 
  });
  console.log(`La documentación estará disponible en http://localhost:${port}/api-docs`);
};

export { swaggerSpec, swaggerUI };


