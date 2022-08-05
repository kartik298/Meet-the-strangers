export const getIncomingCallDialog = (
  callTypeInfo,
  acceptCallHandler,
  rejectCallHandler
) => {
  const dialog = document.createElement("div");
  dialog.classList.add("dialog_wrapper");
  const dialogContent = document.createElement("div");
  dialogContent.classList.add("dialog_content");
  dialog.appendChild(dialogContent);

  const title = document.createElement("p");
  title.classList.add("dialog_title");
  title.innerText = `Incoming ${callTypeInfo} Call`;

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("dialog_image_container");
  const image = document.createElement("img");
  const avatarImagePath = "./utils/images/dialogAvatar.png";
  image.src = avatarImagePath;
  imageContainer.appendChild(image);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("dialog_button_container");

  const acceptCallButton = document.createElement("button");
  acceptCallButton.classList.add("dialog_accept_call_button");
  const acceptCallImage = document.createElement("img");
  acceptCallImage.classList.add("dialog_button_image");
  const acceptCallImagePath = "./utils/images/acceptCall.png";
  acceptCallImage.src = acceptCallImagePath;
  acceptCallButton.appendChild(acceptCallImage);
  buttonContainer.appendChild(acceptCallButton);

  const rejectCallButton = document.createElement("button");
  rejectCallButton.classList.add("dialog_reject_call_button");
  const rejectCallImage = document.createElement("img");
  rejectCallImage.classList.add("dialog_button_image");
  const rejectCallImagePath = "./utils/images/rejectCall.png";
  rejectCallImage.src = rejectCallImagePath;
  rejectCallButton.appendChild(rejectCallImage);
  buttonContainer.appendChild(rejectCallButton);

  dialogContent.appendChild(title);
  dialogContent.appendChild(imageContainer);
  dialogContent.appendChild(buttonContainer);

  acceptCallButton.addEventListener("click", () => {
    acceptCallHandler();
  });

  rejectCallButton.addEventListener("click", () => {
    rejectCallHandler();
  });

  return dialog;

  // document.querySelector("#dialog").appendChild(dialog);
};

export const getCallingDialog = (rejectCallHandler) => {
  const dialog = document.createElement("div");
  dialog.classList.add("dialog_wrapper");
  const dialogContent = document.createElement("div");
  dialogContent.classList.add("dialog_content");
  dialog.appendChild(dialogContent);

  const title = document.createElement("p");
  title.classList.add("dialog_title");
  title.innerText = `Calling`;

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("dialog_image_container");
  const image = document.createElement("img");
  const avatarImagePath = "./utils/images/dialogAvatar.png";
  image.src = avatarImagePath;
  imageContainer.appendChild(image);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("dialog_button_container");

  const hangUpCallButton = document.createElement("button");
  hangUpCallButton.classList.add("dialog_reject_call_button");
  const hangUpCallImage = document.createElement("img");
  hangUpCallImage.classList.add("dialog_button_image");
  const hangUpCallImagePath = "./utils/images/rejectCall.png";
  hangUpCallImage.src = hangUpCallImagePath;
  hangUpCallButton.appendChild(hangUpCallImage);
  buttonContainer.appendChild(hangUpCallButton);

  dialogContent.appendChild(title);
  dialogContent.appendChild(imageContainer);
  dialogContent.appendChild(buttonContainer);

  hangUpCallButton.addEventListener("click", () => {
    rejectCallHandler();
  });

  return dialog;
};

export const getInfoDialog = (title, description) => {
  const dialog = document.createElement("div");
  dialog.classList.add("dialog_wrapper");
  const dialogContent = document.createElement("div");
  dialogContent.classList.add("dialog_content");
  dialog.appendChild(dialogContent);

  const tit = document.createElement("p");
  tit.classList.add("dialog_title");
  tit.innerText = title;

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("dialog_image_container");
  const image = document.createElement("img");
  const avatarImagePath = "./utils/images/dialogAvatar.png";
  image.src = avatarImagePath;
  imageContainer.appendChild(image);

  const desc = document.createElement("p");
  desc.classList.add("dialog_description");
  desc.innerText = description;

  dialogContent.appendChild(tit);
  dialogContent.appendChild(imageContainer);
  dialogContent.appendChild(desc);

  return dialog;
};

export const getLeftMessage = (message) => {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message_left_container");
  const messageParagraph = document.createElement("p");
  messageParagraph.classList.add("message_left_paragraph");
  messageParagraph.innerText = message;

  messageContainer.appendChild(messageParagraph);

  return messageContainer;
};

export const getRightMessage = (message) => {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message_right_container");
  const messageParagraph = document.createElement("p");
  messageParagraph.classList.add("message_right_paragraph");
  messageParagraph.innerText = message;

  messageContainer.appendChild(messageParagraph);

  return messageContainer;
};
