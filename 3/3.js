const wsUri = "wss://echo.websocket.org/";

const chatField = document.querySelector(".chat_field");
const msgField = document.querySelector("#msg");
const exitButton = document.querySelector(".button--exit");
const connectButton = document.querySelector(".button-connect");
const form = document.querySelector(".form");

function writeToScreen(message, isSend = true, isError = false) {
  let pre = document.createElement("p");
  pre.insertAdjacentHTML("afterbegin", message);
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
      if (e.data.includes("www.openstreetmap.org")) return;
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
  sendMessage();
});
exitButton.addEventListener("click", exitChat);

function sendMessage(msg = "") {
  if (websocket && msg) {
    websocket.send(msg);
    writeToScreen(msg);
  } else if (websocket && !msg && msgField.value) {
    websocket.send(msgField.value);
    writeToScreen(`SENT: ${msgField.value}`);
  } else if (!websocket) {
    writeToScreen(
      `<div>Пдключись к чату</div>`,
      (isSend = false),
      (isError = true)
    );
  }
}
function exitChat() {
  websocket.close();
  websocket = null;
}

const geoButton = document.querySelector("#geo");
const error = () => {
  writeToScreen(
    `<div>Невозможно получить ваше местоположение</div>`,
    (isSend = false),
    (isError = true)
  );
};

const success = (position) => {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const geoLink = `<a href="https://www.openstreetmap.org/#map=18/${latitude}/${longitude}" target="_blank">Геолокация</a>`;
  sendMessage(geoLink);
  // return geoLink;
};

geoButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    writeToScreen(
      `<div>Geolocation не поддерживается вашим браузером</div>`,
      (isSend = false),
      (isError = true)
    );
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }
});
