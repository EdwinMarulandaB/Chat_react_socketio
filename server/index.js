import express from "express";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import http from "http";
import cors from "cors";
import config from "./config.js";
import {dirname,join} from 'path'
import {fileURLToPath} from 'url'

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url))
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    /* origin: "http://localhost:3000", */
  },
});

app.use(cors());
app.use(morgan("dev"));
app.set("port", config.PORT);

io.on("connection", (socket) => {
  socket.on("message", (message) => {
    socket.broadcast.emit("message", {
      body: message,
      from: socket.id,
    });
  });
});

app.use(express.static(join(__dirname,'../client/build')))

server.listen(app.get("port"));

console.log(`server on port ${app.get("port")}`);
