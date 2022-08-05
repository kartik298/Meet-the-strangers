import { getState } from "./store.js";

let mediaRecorder;

const vp9Codec = "video/webm; codecs=vp=9";

const vp9Options = {
  mimeType: vp9Codec,
};

let recorderChunks = [];

export const startRecording = () => {
  const remoteStream = getState().remoteStream;

  if (MediaRecorder.isTypeSupported(vp9Codec)) {
    mediaRecorder = new MediaRecorder(remoteStream, vp9Options);
  } else {
    mediaRecorder = new MediaRecorder(remoteStream);
  }

  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
};

export const pauseRecording = () => {
  mediaRecorder.pause();
};

export const resumeRecording = () => {
  mediaRecorder.resume();
};

export const stopRecording = () => {
  mediaRecorder.stop();
};

const downloadRecordedVideo = () => {
  console.log("here");
  const blob = new Blob(recorderChunks, {
    type: "video/webm",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none;";
  a.href = url;
  a.download = "recording.webm";
  a.click();
  window.URL.revokeObjectURL(url);
};

const handleDataAvailable = (e) => {
  if (e.data.size > 0) {
    recorderChunks.push(e.data);
    downloadRecordedVideo();
  }
};
