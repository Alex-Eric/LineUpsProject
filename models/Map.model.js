const { Schema, model } = require("mongoose");

const mapSchema = new Schema(
    {
      name:{
        type:String,
        required: true,
        unique: true
      },
      image: {
        type: String,
        required: true,
        unique: true
      }
    }
)

module.exports = model("Map", mapSchema);
