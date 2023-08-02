const channelID = "5Zua3dN27uQpUHLP";

const drone = new ScaleDrone(channelID, {
  data: {
    name: getRandomName(),
    color: getRandomColor(),
  },
});
let members = [];
drone.on("open", (error) => {
  if (error) {
    return console.error(error);
  }
  console.log("Successfully connected to Scaledrone");

  const room = drone.subscribe("observable-room");
  room.on("open", (error) => {
    if (error) {
      return console.error(error);
    }
    console.log("Successfully joined room");
  });
  room.on("members", (m) => {
    members = m;
    updateMembersDOM();
  });
  room.on("member_join", (member) => {
    members.push(member);
    updateMembersDOM();
  });
  room.on("member_leave", ({ id }) => {
    const index = members.findIndex((member) => member.id === id);
    members.splice(index, 1);
    updateMembersDOM();
  });
  room.on("data", (text, member) => {
    if (member) {
      addMessageToListDOM(text, member);
    } else {
    }
  });
});

drone.on("close", (event) => {
  console.log("Connection was closed", event);
});
drone.on("error", (error) => {
  console.error(error);
});
function getRandomName() {
  const nouns = [
    "waterfall",
    "river",
    "breeze",
    "moon",
    "rain",
    "wind",
    "sea",
    "morning",
    "snow",
    "lake",
    "sunset",
    "pine",
    "shadow",
    "leaf",
    "dawn",
    "glitter",
    "forest",
    "hill",
    "cloud",
    "meadow",
    "sun",
    "glade",
    "bird",
    "brook",
    "butterfly",
    "bush",
    "dew",
    "dust",
    "field",
    "fire",
    "flower",
    "firefly",
    "feather",
    "grass",
    "haze",
    "mountain",
    "night",
    "pond",
    "darkness",
    "snowflake",
    "silence",
    "sound",
    "sky",
    "shape",
    "surf",
    "thunder",
    "violet",
    "water",
    "wildflower",
    "wave",
    "water",
    "resonance",
    "sun",
    "wood",
    "dream",
    "cherry",
    "tree",
    "fog",
    "frost",
    "voice",
    "paper",
    "frog",
    "smoke",
    "star",
  ];
  return nouns[Math.floor(Math.random() * nouns.length)];
}
function getRandomColor() {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
}

// DOM functions

const DOM = {
  members: document.querySelector(".members"),
  messages: document.querySelector(".messages"),
  input: document.querySelector(".input"),
  messageInput: document.querySelector("#message-input"),
  buttonInput: document.querySelector("#message-button"),
};

DOM.buttonInput.addEventListener("submit", sendMessage);
function sendMessage() {
  console.log("Starting sendMessage()");
  const value = DOM.messageInput.value;
  if (value === "") {
    return;
  }
  DOM.messageInput.value = "";
  drone.publish({
    room: "observable-room",
    message: value,
  });
}

function createMemberElement(member) {
  const { name, color } = member.clientData;
  const el = document.createElement("div");
  el.appendChild(document.createTextNode(name));
  el.className = "member";
  el.style.color = color;
  return el;
}
function updateMembersDOM() {
  //DOM.membersCount.innerText = `${members.length} users in room:`;
  //DOM.members.innerHTML = "";
  members.forEach((member) =>
    DOM.members.appendChild(createMemberElement(member))
  );
}

function createMessageElement(text, member) {
  const el = document.createElement("div");
  el.appendChild(createMemberElement(member));
  el.appendChild(document.createTextNode(text));
  el.className = "message";
  return el;
}

function addMessageToListDOM(text, member) {
  const el = DOM.messages;
  const wasTop = el.scrollTop === el.scrollHeight - el.clientHeight;
  el.appendChild(createMessageElement(text, member));
  if (wasTop) {
    el.scrollTop = el.scrollHeight - el.clientHeight;
  }
}
/*
function submit() {
  console.log("Starting submit() method!");
  text = DOM.messageInput.innerHTML;
}
*/
