const { Schema, model } = require("mongoose");

const lineUpSchema = new Schema(
    {
      title:{
        type:String,
        required: true,
        unique: true
      },
      videoLineup: {
        type: String,
        required: true,
        unique: true
      },
      attackDefense: {
        type: String,
        required: true,
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
