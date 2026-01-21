import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

const app = express();

app.get("/", (req, res) => res.send("OK"));

const server = http.createServer(app);

// ✅ WebSocket on ROOT path "/"
const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  console.log("WS connected");

  socket.send(JSON.stringify({ type: "hello" }));

  socket.on("message", (msg) => {
    for (const client of wss.clients) {
      if (client.readyState === 1) {
        client.send(msg.toString());
      }
    }
  });
});

server.listen(process.env.PORT || 3000, "0.0.0.0");
