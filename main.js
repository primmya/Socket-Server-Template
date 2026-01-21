import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

const app = express();

// optional: shows "server is alive" on normal https
app.get("/", (req, res) => res.send("OK"));

const server = http.createServer(app);

// ✅ WebSocket endpoint will be at /ws
const wss = new WebSocketServer({ server });


wss.on("connection", (socket) => {
  console.log("WS connected");

  socket.send(JSON.stringify({ type: "hello", from: "server" }));

  socket.on("message", (data) => {
    // broadcast to everyone
    for (const client of wss.clients) {
      if (client.readyState === 1) client.send(data.toString());
    }
  });
});

// ✅ SUPER IMPORTANT: use env PORT and bind 0.0.0.0
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => console.log("listening on", PORT));
