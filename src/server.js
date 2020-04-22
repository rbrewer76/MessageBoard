const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

const apiRoutes = require("./routes/api")

const app = express()

app.use(express.static("public"))

app.use(cors({ origin: "*" }))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.route("/").get((req, res) => {
  res.sendFile(process.cwd() + "/src/views/index.html")
})

app.route("/post").get((req, res) => {
  res.sendFile(process.cwd() + "/src/views/post.html")
})

apiRoutes(app)

app.listen(3000, () => {
  console.log("Listening on port 3000")
})
