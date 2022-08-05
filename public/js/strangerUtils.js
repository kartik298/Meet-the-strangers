import * as wss from "./wss.js";
import * as webRTCHandler from "./webRTCHandler.js";
import * as ui from "./ui.js";
let strangerCallType;

export const changeStrangerConnectionStatus = (status) => {
  const data = { status };
  wss.changeStrangerConnectionStatus(data);
};

export const getStrangerSocketIdAndConnect = (callType) => {
  strangerCallType = callType;
  wss.getStrangerSocketId();
};

export const connectWithStranger = (data) => {
  const { randomStrangerSocketId } = data;
  if (randomStrangerSocketId) {
    webRTCHandler.sendPreOffer({
      calleePersonalCode: randomStrangerSocketId,
      callType: strangerCallType,
    });
  } else {
    ui.showNoStrangerAvailableDialog();
  }
};
