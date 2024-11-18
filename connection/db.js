const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Database Connected: ${connect.connection.host}`);
  } catch (error) {
    console.log("Connect to DB error");
    console.log(error);
  }
};

module.exports = connectDB;
