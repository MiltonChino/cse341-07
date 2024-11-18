const express = require("express");
const router = express.Router();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");

router.get("/", (req, res) => {
  res.send("Docs API");
});
router.use("/users", require("./users"));
router.use("/docs", require("./docs"));

router.use("/api-docs", swaggerUi.serve);
router.get("/api-docs", swaggerUi.setup(swaggerDocument));

module.exports = router;
