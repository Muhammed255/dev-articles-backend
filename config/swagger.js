import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import express from "express";
import path from 'path'

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
  apis: process.env.NODE_ENV === 'development' ? ["./routes/*.js"] : [path.join(__dirname , ".." ,".." ,"routes", "*.routes.js")],
};

// const options = {
//   swaggerDefinition,
//   apis: ["../routes/*.js", "../../routes/*.js", "./routes/*.js", "./**/*.route.js", "./**/*.routes.js"]
// };

export const setupSwagger = (app) => {
	console.log('====================================');
	console.log("__DIRENAME", __dirname, path.join(__dirname , ".." ,".." ,"routes", "*.routes.js"));
	console.log('====================================');
  const swaggerSpec = swaggerJSDoc(options);
  const swaggerRouter = express.Router();

  swaggerRouter.use("/", swaggerUi.serve);
  swaggerRouter.get("/", swaggerUi.setup(swaggerSpec));

  app.use("/api-docs", swaggerRouter);
};



// export default function swaggerDocs(app) {
//   app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// }