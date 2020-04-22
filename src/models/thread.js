const mongoose = require("mongoose")
const Schema = mongoose.Schema

const threadSchema = Schema({
  board: {
    required: true,
    type: Schema.Types.ObjectId
  },
  title: {
    required: true,
    type: String,
    trim: true,
    min: 5,
    max: 100
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
  bumpedOn: {
    type: Date,
    default: Date.now
  },
  bumpedBy: {
    type: String,
    trim: true,
    min: 5,
    max: 30,
    default: ""
  },
  reported: {
    type: Boolean,
    default: false
  },
  numViews: {
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

const Thread = mongoose.model("thread", threadSchema)

module.exports = Thread
