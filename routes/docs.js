const express = require("express");
const router = express.Router();

const docsController = require("../controllers/docs");

router.get("/", docsController.getAll);

router.get("/:id", docsController.getOne);

router.post("/", docsController.insertDoc);

router.put("/:id", docsController.updateDoc);

router.delete("/:id", docsController.deleteDoc);

module.exports = router;
