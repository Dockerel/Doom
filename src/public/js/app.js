const socket = io();

const welcome = document.querySelector("#welcome");
const form = welcome.querySelector("form");
const nickName = document.getElementById("nickname");
const room = document.getElementById("room");
let roomName = "";

nickName.hidden = true;
room.hidden = true;

function addMessage(msg) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = msg;
  ul.appendChild(li);
}

function handleMessageSubmit(e) {
  e.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function showRoom() {
  nickName.hidden = true;
  room.hidden = false;
  const msgForm = room.querySelector("#msg");
  msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleNicknameSubmit(e) {
  e.preventDefault();
  const input = nickName.querySelector("#nickname input");
  socket.emit("nickname", input.value);
  socket.emit("enter_room", roomName, showRoom);
}

function showNickname() {
  const nickName = document.getElementById("nickname");
  welcome.hidden = true;
  nickName.hidden = false;
  const h3 = document.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
}

function handleRoomSubmit(e) {
  e.preventDefault();
  const input = form.querySelector("input");
  roomName = input.value;
  input.value = "";
  showNickname();
  const nameForm = nickName.querySelector("form");
  nameForm.addEventListener("submit", handleNicknameSubmit);
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user) => {
  addMessage(`${user} joined!`);
});

socket.on("bye", (left) => {
  addMessage(`${left} left 😢`);
});

socket.on("new_message", addMessage);
