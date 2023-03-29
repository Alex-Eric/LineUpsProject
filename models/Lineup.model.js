const { Schema, model } = require("mongoose");

const lineUpSchema = {
  title: {
    type: String,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  videoUrl: {
    type: String,
    required: true,
  },
  lineUpType: {
    type: String,
    required: true,
    enum: ["attack", "defense"]
  },
  map: {
    type: Schema.Types.ObjectId,
    ref: "Map",
  },
  agent: {
    type: Schema.Types.ObjectId,
    ref: "Agent",
  },
  ranking: {
    type: Number,
    default: 0
  },
  userVoted: {
    type: [Schema.Types.ObjectId],
    ref: "User",
  }
};

module.exports = model("lineup", lineUpSchema);
