const express = require('express');
const path = require('path');
const swaggerJSDoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")
const app = express();
const port = 3000;
const routes = require('./routes');
require('dotenv').config();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User API",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        accessToken: {
          type: "apiKey",
          in: "header",
          name: "access_token"
        }
      }
    }
  },
  apis: ["./routes/*.js"],
};
const swaggerDoc = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require('cors');

app.use(cors());

app.use(routes);

console.log('Server is running on port', port);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});