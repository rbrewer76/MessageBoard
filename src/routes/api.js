const mongoose = require("mongoose")

const Group = require("../models/group")
const Board = require("../models/board")
const Thread = require("../models/thread")
const Reply = require("../models/reply")

mongoose.connect(process.env.MONGO_URI, {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
})

setTimeout(() => {
  console.log("mongoose connected: " + mongoose.connection.readyState)
}, 2000)

module.exports = app => {
  app.route("/api/groups/")

    // Return a list of Groups
    .get((req, res) => {
      Group.find({}).select(["-__v"]).then(data => res.json(data))
    })

    // Make a new Group
    .post((req, res) => {
      const group = req.body.group
      Group.findOne({ name: group }).then(data => {
        if (data === null) {
          const newGroup = new Group({ name: group })
          newGroup.save()
            .then(res.json("New Group added."))
            .catch(err => res.json({ error: err }))
        }
      })
    })

  app.route("/api/boards/")

    // Return a list of Boards
    .get((req, res) => {
      Board.find({}).select(["-__v"]).then(data => res.json(data))
    })

    // Make a new Board
    .post((req, res) => {
      const { group, board } = req.body
      Board.findOne({ name: board }).then(data => {
        if (data === null) {
          const newBoard = new Board({ group: group, name: board })
          newBoard.save()
            .then(res.json("New Board added."))          
            .catch(err => res.json({ error: err }))
        }
      })
    })

  app.route("/api/threads/:board")

    // Return a list of Threads for a specified Board
    .get((req, res) => {
      Thread.find({ board: req.params.board }).select(["-__v"]).then(data => {
        data.sort((a, b) => b.bumpedOn - a.bumpedOn)
        res.json(data)
      })
    })

  app.route("/api/threads/")    
    // Make a new Thread on a Board
    .post((req, res) => {
      const { board, title, text, createdBy } = req.body
      Board.findOne({ _id: board }).then(data => {
        if (data !== null) {
          const newThread = new Thread({ board: board, title: title, text: text, createdBy: createdBy })
          newThread.save()
            .then(() => Board.findByIdAndUpdate(board, { $inc: { numThreads: 1 }}))
            .catch(err => res.json({ error: err }))
            .then(res.json("New Thread added."))
        }
        else
          res.json("Cannot post new Thread. Board not found.") 
      })
    })

  app.route("/api/replies/:thread")

    // Return a list of Replies for a specified Thread
    .get((req, res) => {
      const thread = req.params.thread
      Thread.findByIdAndUpdate(thread, { $inc: { numViews: 1 }}).catch(err => res.json({ error: err })) 
      Thread.findOne({ _id: thread }).then(data => {
        if (data !== null)
          Reply.find({ thread: thread }).then(data => {
            data.sort((a, b) => b.createdOn - a.createdOn)           
            res.json(data)
          })
      })
    })


  app.route("/api/replies/")    
    // Make a new Reply in a Thread
    .post((req, res) => {
      const { thread, text, createdBy } = req.body
      Thread.findOne({ _id: thread }).then(data => {
        if (data !== null) {
          const newReply = new Reply({ thread: thread, text: text, createdBy: createdBy })
          newReply.save()
            .then(() => Thread.findByIdAndUpdate(thread, { bumpedBy: createdBy, $inc: { numReplies: 1 }, bumpedOn: Date.now() }))
            .then(data => Board.findByIdAndUpdate(data.board, { bumpedBy: createdBy , $inc: { numReplies: 1 }}))
            .catch(err => res.json({ error: err }))            
            .then(res.json("New Reply added."))
          }
        else
          res.json("Cannot post new Reply. Thread not found.")          
        })
    })
    
}
