import { setSocketId } from "./store.js";
import { setPersonalCode } from "./ui.js";
import {
  handlePreOffer,
  handlePreOfeerAnswer,
  handleWebRTCOffer,
  handleWebRTCAnswer,
  handleWebRTCCandidate,
  handleConnectedUserHangedUp,
} from "./webRTCHandler.js";
import * as constants from "./constants.js";
import { connectWithStranger } from "./strangerUtils.js";
let socketIo = null;

export const registerSocketEvents = (socket) => {
  socketIo = socket;
  socket.on("connect", () => {
    setSocketId(socket.id);
    setPersonalCode(socket.id);
  });

  socket.on("pre-offer", (data) => {
    handlePreOffer(data);
  });

  socket.on("pre-offer-answer", (data) => {
    handlePreOfeerAnswer(data);
  });

  socket.on("webRTC-signaling", (data) => {
    switch (data.type) {
      case constants.webRTCSignaling.OFFER:
        handleWebRTCOffer(data);
        break;
      case constants.webRTCSignaling.ANSWER:
        handleWebRTCAnswer(data);
        break;
      case constants.webRTCSignaling.ICE_CANDIDATE:
        handleWebRTCCandidate(data);
        break;
      default:
        return;
    }
  });

  socket.on("user-hanged-up", () => {
    handleConnectedUserHangedUp();
  });

  socket.on("stranger-socket-id", (data) => {
    connectWithStranger(data);
  });
};

export const wssSedPreOffer = (data) => {
  socketIo.emit("pre-offer", data);
};

export const wssSendPreOfferAnswer = (data) => {
  socketIo.emit("pre-offer-answer", data);
};

export const sendDataUsingWebRTCSignaling = (data) => {
  socketIo.emit("webRTC-signaling", data);
};

export const sendUserHangedUp = (data) => {
  socketIo.emit("user-hanged-up", data);
};

export const changeStrangerConnectionStatus = (data) => {
  socketIo.emit("stranger-connection-status", data);
};

export const getStrangerSocketId = () => {
  socketIo.emit("get-stranger-socketid");
};
