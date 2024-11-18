const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");

const connectDB = require("./connection/db");

const app = express();
const PORT = 3000 || process.env.PORT;

connectDB();

// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", require("./routes"));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
