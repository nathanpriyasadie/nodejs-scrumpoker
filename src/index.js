const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");

const chatController = require("../controllers/chat");

const router = require("../routes/index");
const listener = require("../src/util/socketio");

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 3001;
const publicDirectoryPath = path.join(__dirname, "../public");

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(publicDirectoryPath));
app.use(router);

listener.listenToChat(socketio(server));

app.use("/", (req, res) => {
  res.send("404 not found");
});

server.listen(port, () => {
  console.log("Server listening on port", port);
});
