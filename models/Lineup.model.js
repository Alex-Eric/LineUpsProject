const { Schema, model } = require("mongoose");

const lineUpSchema = {
  title: {
    type: String,
    required: true,
  },
  creator: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true,
  },
  lineUpType: {
    type: String,
    required: true,
    enum: ["attack", "defense", "both"]
  },
  map: {
    type: Schema.Types.ObjectId,
    ref: "Map",
  },
  agent: {
    type: Schema.Types.ObjectId,
    ref: "Agent",
  },
};

module.exports = model("lineup", lineUpSchema);
