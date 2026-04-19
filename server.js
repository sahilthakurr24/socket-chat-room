import http from "node:http";
import { Server } from "socket.io";
import express from "express";
import path from "node:path";

async function main() {
  const app = express();
  //frontend
  app.use(express.static(path.resolve("./public")));
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("user is connected");
    socket.on("chat-messsage", (msg) => {
      io.emit("chat-message", msg);
     
    });

    socket.on("typing", (name) => {
      socket.broadcast.emit("typing", name);
    });

    socket.on("stop-typing", () => {
      socket.broadcast.emit("stop-typing");
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  server.listen(8000, () => {
    console.log("server is running on : http://localhost:8000");
  });
}

main();
