const mongoose = require("mongoose");

const docSchema = mongoose.Schema(
  {
    doc: {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      sentBy: {
        type: String,
        required: true,
      },
      updatedBy: {
        type: String,
        required: true,
      },
      source: {
        type: String,
        required: true,
      },
      approval: {
        type: Number,
        required: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("docs", docSchema);
