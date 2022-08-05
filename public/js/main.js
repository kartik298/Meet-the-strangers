import { registerSocketEvents } from "./wss.js";
import { getState, setAllowConnectionsFromStrangers } from "./store.js";
import {
  sendPreOffer,
  getLocalPreview,
  switchBetweenCameraAndScreenSharing,
  sendMessageUsingDataChannel,
  handleHangUp,
} from "./webRTCHandler.js";
import { callType } from "./constants.js";
import * as ui from "./ui.js";
import {
  pauseRecording,
  resumeRecording,
  startRecording,
  stopRecording,
} from "./recordingUtils.js";
import {
  changeStrangerConnectionStatus,
  getStrangerSocketIdAndConnect,
} from "./strangerUtils.js";
// Socket Connection
const socket = io("/");
registerSocketEvents(socket);
getLocalPreview();

// Copy personal code functionality
const personalCodeCopyButton = document.querySelector(
  "#personal_code_copy_button"
);
personalCodeCopyButton.addEventListener("click", (e) => {
  const personalCode = getState().socketId;
  navigator.clipboard && navigator.clipboard.writeText(personalCode);
});

// connection buttons
const personalCodeChatButton = document.querySelector(
  "#personal_code_chat_button"
);
const personalCodeVideoButton = document.querySelector(
  "#personal_code_video_button"
);

const personalCodeInput = document.querySelector("#personal_code_input");

personalCodeChatButton.addEventListener("click", (e) => {
  sendPreOffer({
    callType: callType.CHAT_PERSONAL_CODE,
    calleePersonalCode: personalCodeInput.value,
  });
});
personalCodeVideoButton.addEventListener("click", (e) => {
  sendPreOffer({
    callType: callType.VIDEO_PERSONAL_CODE,
    calleePersonalCode: personalCodeInput.value,
  });
});

// video call buttons listeners
document.querySelector("#mic_button").addEventListener("click", () => {
  const localStream = getState().localStream;
  const micEnabled = localStream.getAudioTracks()[0].enabled;
  localStream.getAudioTracks()[0].enabled = !micEnabled;

  ui.updateMicButton(!micEnabled);
});

document.querySelector("#camera_button").addEventListener("click", () => {
  const localStream = getState().localStream;
  const cameraEnabled = localStream.getVideoTracks()[0].enabled;
  localStream.getVideoTracks()[0].enabled = !cameraEnabled;

  ui.updateCamersButton(!cameraEnabled);
});

document
  .querySelector("#screen_sharing_button")
  .addEventListener("click", () => {
    const screenSharingActive = getState().screenSharingActive;
    switchBetweenCameraAndScreenSharing(screenSharingActive);
  });

document
  .querySelector("#new_message_input")
  .addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      sendMessageUsingDataChannel(e.target.value);
      ui.appendMessage(e.target.value, true);
      document.querySelector("#new_message_input").value = "";
    }
  });

document.querySelector("#send_message_button").addEventListener("click", () => {
  const message = document.querySelector("#new_message_input").value;
  sendMessageUsingDataChannel(message);
  ui.appendMessage(message, true);
  document.querySelector("#new_message_input").value = "";
});

document
  .querySelector("#start_recording_button")
  .addEventListener("click", () => {
    startRecording();
    ui.showRecordingPannel();
  });

document
  .querySelector("#stop_recording_button")
  .addEventListener("click", () => {
    stopRecording();
    ui.resetRecordingButtos();
  });

document
  .querySelector("#pause_recording_button")
  .addEventListener("click", () => {
    pauseRecording();
    ui.switchRecordingButtons(true);
  });
document
  .querySelector("#resume_recording_button")
  .addEventListener("click", () => {
    resumeRecording();
    ui.switchRecordingButtons();
  });

// hang up
document.querySelector("#hang_up_button").addEventListener("click", () => {
  handleHangUp();
});

document
  .querySelector("#finish_chat_call_button")
  .addEventListener("click", () => {
    handleHangUp();
  });

const strangerChatButton = document.querySelector("#stranger_chat_button");
const strangerVideoButton = document.querySelector("#stranger_video_button");

strangerChatButton.addEventListener("click", () => {
  getStrangerSocketIdAndConnect(callType.CHAT_STRANGER);
});
strangerVideoButton.addEventListener("click", () => {
  getStrangerSocketIdAndConnect(callType.VIDE_STRANGER);
});

const checkBox = document.querySelector("#allow_strangers_checkbox");

checkBox.addEventListener("click", () => {
  const checkboxState = getState().allowConnectionsFromStrangers;
  ui.updateStrangerCheckbox(!checkboxState);
  setAllowConnectionsFromStrangers(!checkboxState);
  changeStrangerConnectionStatus(!checkboxState);
});
