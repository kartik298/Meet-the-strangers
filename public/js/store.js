import * as constants from "./constants.js";

const state = {
  socketId: null,
  localStream: null,
  remoteStream: null,
  screenSharingStream: null,
  allowConnectionsFromStrangers: false,
  screenSharingActive: false,
  callState: constants.callState.CALL_AVILABLE_ONLY_CHAT,
};

export const setSocketId = (value) => {
  state.socketId = value;
};
export const setLocalStream = (value) => {
  state.localStream = value;
};
export const setRemoteStream = (value) => {
  state.remoteStream = value;
};
export const setScreenSharingStream = (value) => {
  state.screenSharingStream = value;
};
export const setAllowConnectionsFromStrangers = (value) => {
  state.allowConnectionsFromStrangers = value;
};
export const setScreenSharingActive = (value) => {
  state.screenSharingActive = value;
};
export const setCallState = (value) => {
  state.callState = value;
};
export const getState = () => {
  return state;
};
