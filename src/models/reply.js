const mongoose = require("mongoose")
const Schema = mongoose.Schema

const replySchema = Schema({
  thread: {
    required: true,
    type: Schema.Types.ObjectId
  },
  text: {
    required: true,
    type: String,
    trim: true,
    min: 5,
    max: 1000
  },
  createdBy: {
    required: true,
    type: String,
    trim: true,
    min: 5,
    max: 30
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
  reported: {
    type: Boolean,
    default: false
  }
})

const Reply = mongoose.model("reply", replySchema)

module.exports = Reply
