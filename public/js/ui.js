import * as constants from "./constants.js";
import {
  getIncomingCallDialog,
  getCallingDialog,
  getInfoDialog,
  getRightMessage,
  getLeftMessage,
} from "./elements.js";

export const setPersonalCode = (socketId) => {
  const personalCode = document.querySelector("#personal_code");
  if (personalCode) personalCode.textContent = socketId;
};

export const showIncomingCallDialog = (
  callType,
  acceptCallHandler,
  rejectCallHandler
) => {
  const callTypeInfo =
    callType === constants.callType.CHAT_PERSONAL_CODE ? "Chat" : "Video";

  const incomingCallDialog = getIncomingCallDialog(
    callTypeInfo,
    acceptCallHandler,
    rejectCallHandler
  );
  const dialog = document.querySelector("#dialog");
  dialog.querySelectorAll("*").forEach((d) => d.remove());

  dialog.appendChild(incomingCallDialog);
};

export const showCallingDialog = (rejectCallHandler) => {
  const callingDialog = getCallingDialog(rejectCallHandler);
  const dialog = document.querySelector("#dialog");
  dialog.querySelectorAll("*").forEach((d) => d.remove());

  dialog.appendChild(callingDialog);
};

export const removeAllDialogs = () => {
  const dialog = document.querySelector("#dialog");
  dialog.querySelectorAll("*").forEach((d) => d.remove());
};

export const showInfoDialog = (preOfferAnswer) => {
  let infoDialog = null;

  if (preOfferAnswer === constants.callAnswers.CALL_REJECTED) {
    infoDialog = getInfoDialog("Call Rejected", "Callee rejected your call");
  }
  if (preOfferAnswer === constants.callAnswers.CALLEE_NOT_FOUND) {
    infoDialog = getInfoDialog(
      "Callee Not Found",
      "Please check personal code"
    );
  }
  if (preOfferAnswer === constants.callAnswers.CALLEE_UNAVAILABLE) {
    infoDialog = getInfoDialog(
      "Call Is Not Possible",
      "Probably callee is busy, please try again later"
    );
  }

  if (infoDialog) {
    const dialog = document.querySelector("#dialog");
    dialog.appendChild(infoDialog);
  }
  setTimeout(() => {
    removeAllDialogs();
  }, [4000]);
};

export const showCallElements = (calltype) => {
  if (
    calltype === constants.callType.CHAT_PERSONAL_CODE ||
    calltype === constants.callType.CHAT_STRANGER
  )
    showChatCallElements();
  if (
    calltype === constants.callType.VIDEO_PERSONAL_CODE ||
    calltype === constants.callType.VIDE_STRANGER
  )
    showVideoCallElements();
};

const showChatCallElements = () => {
  const finishChatButtonContainer = document.querySelector(
    "#finish_chat_button_container"
  );
  showElement(finishChatButtonContainer);
  const newMessageInput = document.querySelector("#new_message");
  showElement(newMessageInput);

  disableDashboard();
};
const showVideoCallElements = () => {
  const callButtons = document.querySelector("#call_buttons");
  showElement(callButtons);
  const videoPlaceholder = document.querySelector("#video_placeholder");
  hideElement(videoPlaceholder);
  const newMessageInput = document.querySelector("#new_message");
  showElement(newMessageInput);
  const remoteVideo = document.querySelector("#remote_video");
  showElement(remoteVideo);

  disableDashboard();
};

const micOnImgSrc = "./utils/images/mic.png";
const micOffImgSrc = "./utils/images/micOff.png";
export const updateMicButton = (micEnabled) => {
  const micButtonImage = document.getElementById("mic_button_image");
  micButtonImage.src = micEnabled ? micOnImgSrc : micOffImgSrc;
};

const cameraOnImgSrc = "./utils/images/camera.png";
const cameraOffImgSrc = "./utils/images/cameraOff.png";
export const updateCameraButton = (cameraEnabled) => {
  const cameraButtonImage = document.getElementById("camera_button_image");
  cameraButtonImage.src = cameraEnabled ? cameraOnImgSrc : cameraOffImgSrc;
};

// helper functions
const enableDashBoard = () => {
  const dashboardBloker = document.querySelector("#dashboard_blur");
  if (!dashboardBloker.classList.contains("display_none")) {
    dashboardBloker.classList.add("display_none");
  }
};
const disableDashboard = () => {
  const dashboardBloker = document.querySelector("#dashboard_blur");
  if (dashboardBloker.classList.contains("display_none")) {
    dashboardBloker.classList.remove("display_none");
  }
};

const hideElement = (element) => {
  if (!element.classList.contains("display_none"))
    element.classList.add("display_none");
};
const showElement = (element) => {
  if (element.classList.contains("display_none"))
    element.classList.remove("display_none");
};
export const updateLocalStream = (stream) => {
  const localVideo = document.querySelector("#local_video");

  localVideo.srcObject = stream;

  localVideo.addEventListener("loadedmetadata", () => {
    localVideo.play();
  });
};
export const updateRemoteVideo = (stream) => {
  const remoteVideo = document.querySelector("#remote_video");

  remoteVideo.srcObject = stream;
};

// messages
export const appendMessage = (message, right = false) => {
  const messageContainer = document.querySelector("#messages_container");

  const messageElement = right
    ? getRightMessage(message)
    : getLeftMessage(message);

  messageContainer.appendChild(messageElement);
};

export const clearMessenger = () => {
  const messageContainer = document.querySelector("#messages_container");
  messageContainer.querySelectorAll("*").forEach((e) => e.remove());
};

export const showRecordingPannel = () => {
  const recordingButtons = document.querySelector("#video_recording_buttons");
  showElement(recordingButtons);

  const startRecordingButton = document.querySelector(
    "#start_recording_button"
  );
  hideElement(startRecordingButton);
};

export const resetRecordingButtos = () => {
  const startRecordingButton = document.querySelector(
    "#start_recording_button"
  );
  showElement(startRecordingButton);

  const recordingButtons = document.querySelector("#video_recording_buttons");
  hideElement(recordingButtons);
};

export const switchRecordingButtons = (switchForResumeButton = false) => {
  const resumeButton = document.querySelector("#resume_recording_button");
  const pauseButton = document.querySelector("#pause_recording_button");

  if (switchForResumeButton) {
    hideElement(pauseButton);
    showElement(resumeButton);
  } else {
    hideElement(resumeButton);
    showElement(pauseButton);
  }
};

export const updateUiAfterHangUp = (ct) => {
  enableDashBoard();

  if (
    ct === constants.callType.VIDEO_PERSONAL_CODE ||
    ct === constants.callType.VIDE_STRANGER
  ) {
    const callButtons = document.getElementById("call_buttons");
    hideElement(callButtons);
  } else {
    const chatCallButton = document.getElementById(
      "finish_chat_button_container"
    );
    hideElement(chatCallButton);
  }
  const newMessageInput = document.getElementById("new_message");
  hideElement(newMessageInput);

  const messagesContainer = document.querySelector("#messages_container");
  messagesContainer.querySelectorAll("*").forEach((node) => node.remove());

  updateMicButton(true);
  updateCameraButton(true);

  const remoteVideo = document.querySelector("#remote_video");
  hideElement(remoteVideo);
  const placeHolder = document.querySelector("#video_placeholder");
  showElement(placeHolder);

  removeAllDialogs();
};

export const showVideoCallButtons = () => {
  showElement(document.querySelector("#personal_code_video_button"));
  showElement(document.querySelector("#stranger_video_button"));
};

export const updateStrangerCheckbox = (checkboxStatus) => {
  const checkbox = document.querySelector("#allow_strnagers_checkbox_image");

  checkboxStatus ? showElement(checkbox) : hideElement(checkbox);
};

export const showNoStrangerAvailableDialog = () => {
  const infoDialog = getInfoDialog(
    "No Stranger Available",
    "Please try again later"
  );

  if (infoDialog) {
    const dialog = document.querySelector("#dialog");
    dialog.appendChild(infoDialog);
  }
  setTimeout(() => {
    removeAllDialogs();
  }, [4000]);
};
