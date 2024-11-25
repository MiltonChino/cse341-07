const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

// const userSchema = mongoose.Schema(
//   {
//     user: {
//       firstName: {
//         type: String,
//         required: true,
//       },
//       lastName: {
//         type: String,
//         required: true,
//       },
//       email: {
//         type: String,
//         required: true,
//         lowercase: true,
//       },
//       level: {
//         type: Number,
//         required: true,
//       },
//     },
//   },
//   { timestamps: true }
// );

const userSchema = mongoose.Schema();

module.exports = mongoose.model("users", userSchema);
