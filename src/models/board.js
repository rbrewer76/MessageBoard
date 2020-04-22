const mongoose = require("mongoose")
const Schema = mongoose.Schema

const boardSchema = Schema({
  group: {
    required: true,
    type: Schema.Types.ObjectId
  },
  name: {
    required: true,
    type: String,
    trim: true,
    min: 5,
    max: 50
  },
  numThreads: {
    type: Number,
    default: 0
  },
  numReplies: {
    type: Number,
    default: 0
  },
  img: {
    type: String,
    default: ""
  }
})

const Board = mongoose.model("board", boardSchema)

module.exports = Board
