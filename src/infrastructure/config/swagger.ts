import swaggerJsdoc from "swagger-jsdoc";

// Read the server URL and port from environment variables, with defaults for local development
const port = process.env.PORT || 3000;
const serverUrl = process.env.SERVER_URL || `http://localhost:${port}`;

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CollabSphere API",
      version: "1.0.0",
      description: "API documentation for the CollabSphere backend service.",
    },
    servers: [
      {
        url: `${serverUrl}/api/v1`,
        description: "API Server",
      },
    ],
  },
  // Paths to files containing OpenAPI definitions
  apis: ["./src/infrastructure/adapters/driving/http/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
