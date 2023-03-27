const { Schema, model } = require("mongoose");

const lineUpSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  videoLineup: {
    type: String,
    required: true,
  },
  attackDefense: {
    type: String,
    required: true,
  },
  map: {
    type: Schema.Types.ObjectId,
    ref: "Map",
  },
  agent: {
    type: Schema.Types.ObjectId,
    ref: "Agent",
  },
});

module.exports = model("lineup", lineUpSchema);
