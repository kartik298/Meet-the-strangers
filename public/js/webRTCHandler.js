import {
  wssSedPreOffer,
  wssSendPreOfferAnswer,
  sendDataUsingWebRTCSignaling,
  sendUserHangedUp,
} from "./wss.js";

import {
  showIncomingCallDialog,
  showCallingDialog,
  removeAllDialogs,
  showInfoDialog,
  showCallElements,
  updateLocalStream,
  updateRemoteVideo,
  appendMessage,
  updateUiAfterHangUp,
  showVideoCallButtons,
} from "./ui.js";
import {
  callAnswers,
  webRTCSignaling,
  callState,
  callType,
} from "./constants.js";
import {
  getState,
  setLocalStream,
  setRemoteStream,
  setScreenSharingStream,
  setScreenSharingActive,
  setCallState,
} from "./store.js";

const connectedUserDetails = {
  socketId: null,
  callType: null,
};
let peerConnection;
let dataChannel;
const defaultConstraints = {
  video: true,
  audio: true,
};
const config = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:13902",
    },
  ],
};

export const getLocalPreview = () => {
  navigator.mediaDevices
    .getUserMedia(defaultConstraints)
    .then((stream) => {
      updateLocalStream(stream);
      setCallState(callState.CALL_AVAILBLE);
      showVideoCallButtons();
      setLocalStream(stream);
    })
    .catch((err) => {
      console.log("error occured when trying to get an access of camera");
      console.log(err);
    });
};

export const createPeerConnection = () => {
  peerConnection = new RTCPeerConnection(config);
  dataChannel = peerConnection.createDataChannel("chat");

  peerConnection.ondatachannel = (e) => {
    const dc = e.channel;
    dc.onopen = () => {
      console.log("peer connection is ready to recieve data channel message");
    };
    dc.onmessage = (event) => {
      const message = JSON.parse(event.data);
      appendMessage(message);
    };
  };

  peerConnection.onicecandidate = (e) => {
    if (e.candidate) {
      sendDataUsingWebRTCSignaling({
        connectedUserSocketId: connectedUserDetails.socketId,
        type: webRTCSignaling.ICE_CANDIDATE,
        candidate: e.candidate,
      });
    }
  };
  peerConnection.onconnectionstatechange = (e) => {
    if (peerConnection.connectionState === "connected") {
      console.log("successfully connected with other peer");
    }
  };

  const remoteStream = new MediaStream();
  setRemoteStream(remoteStream);
  updateRemoteVideo(remoteStream);

  peerConnection.ontrack = (e) => {
    remoteStream.addTrack(e.track);
  };

  if (
    connectedUserDetails.callType === callType.VIDEO_PERSONAL_CODE ||
    connectedUserDetails.callType === callType.VIDE_STRANGER
  ) {
    const localStream = getState().localStream;

    for (const track of localStream.getTracks()) {
      peerConnection.addTrack(track, localStream);
    }
  }
};

export const sendMessageUsingDataChannel = (message) => {
  const stringifiedMessage = JSON.stringify(message);
  dataChannel.send(stringifiedMessage);
};

export const sendPreOffer = (data) => {
  connectedUserDetails.socketId = data.calleePersonalCode;
  connectedUserDetails.callType = data.callType;

  if (
    data.callType === callType.CHAT_PERSONAL_CODE ||
    data.callType === callType.VIDEO_PERSONAL_CODE
  ) {
    showIncomingCallDialog(data.callType, acceptCallHandler, rejectCallHandler);
    showCallingDialog(callingDialogRejectedCallHandler);
    setCallState(callState.CALL_UNAVAILABLE);
    wssSedPreOffer(data);
  }

  if (
    data.callType === callType.CHAT_STRANGER ||
    data.callType === callType.VIDE_STRANGER
  ) {
    setCallState(callState.CALL_UNAVAILABLE);
    wssSedPreOffer(data);
  }
};

export const handlePreOffer = (data) => {
  if (!checkCallPossiblity()) {
    return sendPreOfferAnswer(
      callAnswers.CALLEE_UNAVAILABLE,
      data.callerSocketId
    );
  }
  connectedUserDetails.socketId = data.callerSocketId;
  connectedUserDetails.callType = data.callType;
  setCallState(callState.CALL_UNAVAILABLE);

  if (
    data.callType === callType.CHAT_PERSONAL_CODE ||
    data.callType === callType.VIDEO_PERSONAL_CODE
  )
    showIncomingCallDialog(callType, acceptCallHandler, rejectCallHandler);
  if (
    data.callType === callType.CHAT_STRANGER ||
    data.callType === callType.VIDE_STRANGER
  ) {
    createPeerConnection();
    sendPreOfferAnswer(callAnswers.CALL_ACCEPTED);
    showCallElements(connectedUserDetails.callType);
  }
};

const acceptCallHandler = () => {
  createPeerConnection();
  sendPreOfferAnswer(callAnswers.CALL_ACCEPTED);
  showCallElements(connectedUserDetails.callType);
};
const rejectCallHandler = () => {
  setIncomingCallsAvailbale();
  sendPreOfferAnswer(callAnswers.CALL_REJECTED);
};
const callingDialogRejectedCallHandler = () => {
  const data = {
    connectedUserSocketId: connectedUserDetails.socketId,
  };

  closePerrConnectionAndResetState();

  sendUserHangedUp(data);
};

const sendPreOfferAnswer = (preOfferAnswer, callerSocketId = null) => {
  const csi = callerSocketId ? callerSocketId : connectedUserDetails.socketId;

  const data = {
    callerSocketId: csi,
    preOfferAnswer,
  };
  removeAllDialogs();

  wssSendPreOfferAnswer(data);
};

export const handlePreOfeerAnswer = (data) => {
  const { preOfferAnswer } = data;
  removeAllDialogs();
  if (preOfferAnswer === callAnswers.CALLEE_NOT_FOUND) {
    // Later
    setIncomingCallsAvailbale();
    showInfoDialog(preOfferAnswer);
  }
  if (preOfferAnswer === callAnswers.CALLEE_UNAVAILABLE) {
    // Later
    setIncomingCallsAvailbale();
    showInfoDialog(preOfferAnswer);
  }
  if (preOfferAnswer === callAnswers.CALL_REJECTED) {
    // Later
    setIncomingCallsAvailbale();
    showInfoDialog(preOfferAnswer);
  }
  if (preOfferAnswer === callAnswers.CALL_ACCEPTED) {
    showCallElements(connectedUserDetails.callType);
    createPeerConnection();
    sendWebRTCOffer();
  }
};
const sendWebRTCOffer = async () => {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  sendDataUsingWebRTCSignaling({
    connectedUserSocketId: connectedUserDetails.socketId,
    type: webRTCSignaling.OFFER,
    offer,
  });
};

export const handleWebRTCOffer = async (data) => {
  await peerConnection.setRemoteDescription(data.offer);
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  sendDataUsingWebRTCSignaling({
    connectedUserSocketId: connectedUserDetails.socketId,
    type: webRTCSignaling.ANSWER,
    answer,
  });
};

export const handleWebRTCAnswer = async (data) => {
  await peerConnection.setRemoteDescription(data.answer);
};

export const handleWebRTCCandidate = async (data) => {
  const candidate = await data.candidate;
  try {
    await peerConnection.addIceCandidate(candidate);
  } catch (err) {
    console.error(
      "error occured when trying to add recived ice candidate",
      err
    );
  }
};

let screenSharingStream;

export const switchBetweenCameraAndScreenSharing = async (
  screenSharingActive
) => {
  if (screenSharingActive) {
    const localStream = getState().localStream;
    const senders = peerConnection.getSenders();
    const sender = senders.find(
      (sender) => sender.track.kind === localStream.getVideoTracks()[0].kind
    );
    if (sender) {
      sender.replaceTrack(localStream.getVideoTracks()[0]);
    }

    getState()
      .screenSharingStream.getTracks()
      .forEach((track) => track.stop());

    setScreenSharingActive(!screenSharingActive);
    updateLocalStream(localStream);
  } else {
    try {
      screenSharingStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      setScreenSharingStream(screenSharingStream);

      const senders = peerConnection.getSenders();
      const sender = senders.find(
        (sender) =>
          sender.track.kind === screenSharingStream.getVideoTracks()[0].kind
      );

      if (sender) {
        sender.replaceTrack(screenSharingStream.getVideoTracks()[0]);
      }
      setScreenSharingActive(!screenSharingActive);
      updateLocalStream(screenSharingStream);
    } catch (err) {
      console.log(err);
    }
  }
};

export const handleHangUp = () => {
  const data = {
    connectedUserSocketId: connectedUserDetails.socketId,
  };

  sendUserHangedUp(data);
  closePerrConnectionAndResetState();
};

export const handleConnectedUserHangedUp = () => {
  closePerrConnectionAndResetState();
};

const closePerrConnectionAndResetState = () => {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
  if (
    connectedUserDetails.callType === callType.VIDEO_PERSONAL_CODE ||
    connectedUserDetails.callType === callType.VIDE_STRANGER
  ) {
    getState().localStream.getVideoTracks()[0].enabled = true;
    getState().localStream.getAudioTracks()[0].enabled = true;
  }
  updateUiAfterHangUp(connectedUserDetails.callType);
  setIncomingCallsAvailbale();
  connectedUserDetails.socketId = null;
  connectedUserDetails.callType = null;
};

export const checkCallPossiblity = (ct) => {
  if (getState().callState === callState.CALL_AVAILBLE) {
    return true;
  }

  if (
    getState().callState === callState.CALL_AVILABLE_ONLY_CHAT &&
    (ct === callType.VIDEO_PERSONAL_CODE || ct === callType.VIDE_STRANGER)
  ) {
    return false;
  }
  return false;
};

const setIncomingCallsAvailbale = () => {
  const localStream = getState().localStream;
  if (localStream) {
    setCallState(callState.CALL_AVAILBLE);
  } else {
    setCallState(callState.CALL_AVILABLE_ONLY_CHAT);
  }
};
