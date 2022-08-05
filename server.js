const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

const PORT = process.env.PORT || 3002;
let connectedPeers = [];
let connectedPeersStrangers = [];

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile("index");
});

io.on("connection", (socket) => {
  const id = socket.id;
  connectedPeers.push(id);

  socket.on("pre-offer", (data) => {
    const { callType, calleePersonalCode } = data;

    const connectedPeer = connectedPeers.find(
      (id) => id === calleePersonalCode
    );

    if (connectedPeer) {
      const data = {
        callerSocketId: socket.id,
        callType,
      };
      io.to(calleePersonalCode).emit("pre-offer", data);
    } else {
      io.to(socket.id).emit("pre-offer-answer", {
        preOfferAnswer: "CALLEE_NOT_FOUND",
      });
    }
  });

  socket.on("pre-offer-answer", (data) => {
    const connectedPeer = connectedPeers.find(
      (id) => id === data.callerSocketId
    );

    if (connectedPeer) {
      io.to(data.callerSocketId).emit("pre-offer-answer", data);
    }
  });

  socket.on("webRTC-signaling", (data) => {
    const connectedPeer = connectedPeers.find(
      (id) => id === data.connectedUserSocketId
    );
    if (connectedPeer) {
      io.to(data.connectedUserSocketId).emit("webRTC-signaling", data);
    }
  });

  socket.on("user-hanged-up", (data) => {
    const { connectedUserSocketId } = data;
    const connectedPeer = connectedPeers.find(
      (id) => id === connectedUserSocketId
    );
    if (connectedPeer) {
      io.to(connectedUserSocketId).emit("user-hanged-up");
    }
  });

  socket.on("stranger-connection-status", (data) => {
    const { status } = data;
    if (status) {
      connectedPeersStrangers.push(socket.id);
    } else {
      connectedPeersStrangers = connectedPeersStrangers.filter(
        (c) => c !== socket.id
      );
    }
  });

  socket.on("get-stranger-socketid", () => {
    let randomStrangerSocketId;
    const filteredConnectedPeersStranger = connectedPeersStrangers.filter(
      (c) => c !== socket.id
    );
    if (filteredConnectedPeersStranger.length > 0) {
      randomStrangerSocketId =
        filteredConnectedPeersStranger[
          Math.floor(Math.random() * filteredConnectedPeersStranger.length)
        ];
    } else {
      randomStrangerSocketId = null;
    }

    const data = {
      randomStrangerSocketId,
    };
    io.to(socket.id).emit("stranger-socket-id", data);
  });

  socket.on("disconnect", () => {
    connectedPeers = connectedPeers.filter((peerId) => peerId !== id);
    connectedPeersStrangers = connectedPeersStrangers.filter(
      (c) => c !== socket.id
    );
  });
});

server.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});
