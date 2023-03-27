const { Schema, model } = require("mongoose");

const lineUpSchema = new Schema(
    {
      Title: {
        type: String,
        required: true,
        unique: true,
      },

      Map: {
        type: String,
        required: true,
      },

      Agent: {
        type: String,
        required: true
      }
    }
)

module.exports = model("lineup", lineUpSchema);
