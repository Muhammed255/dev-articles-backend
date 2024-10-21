import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Developers Articles APIs",
    version: "1.0.0",
    description: "API documentation for developers articles",
  },
  servers: [
    {
      url: process.env.NODE_ENV === 'development' ? "http://localhost:3000/api" : "https://developers-articles.netlify.app/api",
      description: process.env.NODE_ENV === 'development' ? "Development server" : 'Stage Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"], // Paths to your route files
};

const swaggerSpec = swaggerJSDoc(options);

export default function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}