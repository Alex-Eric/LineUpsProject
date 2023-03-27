const { Schema, model } = require("mongoose");

const agentSchema = new Schema(
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

module.exports = model("Agent", agentSchema);
