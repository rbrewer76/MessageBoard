const mongoose = require("mongoose")
const Schema = mongoose.Schema

const groupSchema = Schema({
  name: {
    required: true,
    type: String,
    trim: true,
    min: 5,
    max: 50
  }
})

const Group = mongoose.model("group", groupSchema)

module.exports = Group
