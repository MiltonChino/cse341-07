const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "My contacts API",
    description: "Here you will save the contacts you need",
  },
  host: "localhost:3000",
};

const outputFile = "./swagger.json";
const routes = ["./routes/index", "./routes/users", "./routes/docs"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
