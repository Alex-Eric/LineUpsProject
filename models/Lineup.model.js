const { Schema, model } = require("mongoose");

const lineUpSchema = new Schema(
    {
      videoLineup: {
        type: String,
        required: true
      },
      attackDefense: {
        type: String,
        required: true,
        unique: true,
      },

      map: {
        type: String,
        required: true,
      },

      agent: {
        type: String,
        required: true
      }
    }
)

module.exports = model("lineup", lineUpSchema);
