const wsUri = "wss://echo.websocket.org/";

const chatField = document.querySelector(".chat_field");
const msgField = document.querySelector("#msg");
const exitButton = document.querySelector(".button--exit");
const connectButton = document.querySelector(".button-connect");
const form = document.querySelector(".form");

function writeToScreen(message, isSend = true, isError = false) {
  let pre = document.createElement("p");
  pre.innerHTML = message;
  pre.classList.add("message");
  isSend
    ? pre.classList.add("message-send")
    : pre.classList.add("message-receive");

  if (isError) {
    pre.classList.add("message-error");
    pre.classList.remove("message-send");
    pre.classList.remove("message-receive");
  }
  chatField.appendChild(pre);
}

let websocket;
function conntection() {
  if (!websocket) {
    websocket = new WebSocket(wsUri);
    websocket.onopen = function (e) {
      writeToScreen("CONNECTED");
    };
    websocket.onclose = function (e) {
      writeToScreen("DISCONNECTED");
    };
    websocket.onmessage = function (e) {
      const isSend = false;
      const receivedMessage = `<span class="received-message">RESPONSE: ${e.data}</span>`;
      writeToScreen(receivedMessage, isSend);
    };
    websocket.onerror = function (e) {
      writeToScreen(`<span style="color: red;">ERROR:</span> ${e.data}`);
    };
  }
}

window.addEventListener("load", conntection);
connectButton.addEventListener("click", conntection);
form.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage(msgField.value);
});
exitButton.addEventListener("click", exitChat);

function sendMessage() {
  if (websocket) {
    websocket.send(msgField.value);
    writeToScreen(`SENT: ${msgField.value}`);
  } else
    writeToScreen(
      `<div>Пдключись к чату</div>`,
      (isSend = false),
      (isError = true)
    );
}
function exitChat() {
  websocket.close();
  websocket = null;
}
