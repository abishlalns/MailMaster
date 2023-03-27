let data, messageId;
const currentUser = window.sessionStorage.getItem("userEmail");
let currentTab = window.sessionStorage.getItem("currentTab");

// get url
const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
let userUrl = params.user; // "some_value"

if (!currentUser || userUrl != currentUser) {
  location.href = "login.html";
}

document.querySelector(`#${currentTab}`)?.classList.add("active");
["Inbox", "SentBox", "Unread", "Trash", "Draft"].map((id) => {
  document.querySelector(`#${id}`).addEventListener("click", () => {
    checkDraft();
    getMessages(`${id}`);
    document.querySelector(".active")?.classList.remove("active");
    document.querySelector(`#${id}`).classList = "active";
    document.querySelector(`#${id}`).classList = "active";
  });
});

document.querySelector("#search").addEventListener("change", (element) => {
  let searchValue = element.target.value;
  fetch(`http://localhost:3000/search/${searchValue}/${currentUser}`)
    .then((res) => res.json())
    .then((value) => {
      console.log(value);
      data = value;
      displayMessages(`Search for "${searchValue}"`, data, currentTab);
    });
});

if (currentTab == "compose") {
  composeMail();
} else {
  getMessages(currentTab);
}

async function getMessages(type) {
  currentTab = type;
  window.sessionStorage.setItem("currentTab", type);
  let inboxMessages = await fetch(
    `http://localhost:3000/getmessages/${type}/${currentUser}`
  );
  await inboxMessages.json().then((value) => {
    data = value;
    displayMessages(type, data, currentTab);
  });
}

function displayMessages(type, value, currentTab) {
  if (value.length) {
    document.querySelector(".rightSection").style.backgroundImage = "none";
  } else {
    document.querySelector(".rightSection").style.backgroundImage =
      "url('./assets/noMessages.png')";
  }
  let linkTitle = "Move To Trash";
  let restoreVisible = "hidden";
  if (currentTab == "Trash") {
    restoreVisible = "visible";
  }
  let displayHTMl = ``;
  displayHTMl += `<div class="title" id="type">
    <h1>${type}</h1>
  </div>
  <div class="messages"></div>`;
  document.querySelector(".rightSection").innerHTML = displayHTMl;
  let messageHTML = ``;
  value.forEach((element, index) => {
    let time = moment(element.time).format("dddd, MMMM Do YYYY, h:mm:ss a");
    let status =
      element.sender != currentUser
        ? markAsRead(element.status)
        : "messageRead";
    messageHTML += `
    <div class="iconLinks ${status}">
          <h1 class="title" onclick="showMessage('${index}')">${element.title}</h1>
          <a title="Restore" class="restore" onclick="restore('${index}')" style="visibility: ${restoreVisible}">
            <img src="./assets/restore.svg" alt="trash">
          </a>
          <a title="${linkTitle}" onclick="moveToTrash('${index}')">
            <img src="./assets/delete.svg" alt="trash">
          </a>
        </div>
        <div class="message messageRead ${status}" onclick="showMessage('${index}', '${currentTab}')">
          <div class="userMail">
            <h3>From: ${element.sender}</h3>
            <h3 class="time">${time}</h3>
          </div>
          <h3 class="receiver">To: ${element.receiver}</h3>
          <div class="mailBody">
            <p class="mailMessage">
              ${element.message}
            </p>
          </div>
        </div>`;
  });
  document.querySelector(".messages").innerHTML = messageHTML;
}

function markAsRead(status) {
  return status == "unread" ? "messageUnRead" : "messageRead";
}

let messageHTML = ``;
async function showMessage(index, currentTab) {
  if (currentTab == "Draft") {
    composeMail(index);
  } else {
    let message = data[index];
    if (message.status == "unread") {
      fetch(`http://localhost:3000/status/${message.time}`);
    }
    let time = moment(message.time).format("dddd, MMMM Do YYYY, h:mm:ss a");
    messageHTML = `<div class="readMessages">
    <div class="readMessage">
      <h1 class="title">${message.title}</h1>
      <div class="mailDetails">
        <div class="mailInfo">
          <h1>${message.sender}</h1>
          <div class="recieverMail">
            <h2>To: ${message.receiver}</h2>
            <p class="time">${time}</p>
          </div>
        </div>
        <div class="mailbody">
          ${message.message}
        </div>
      </div>
    </div>
  </div>`;
    document.querySelector(".rightSection").innerHTML = messageHTML;
  }
}

async function moveToTrash(index) {
  let message = data[index];
  if (currentTab == "Trash") {
    await fetch(`http://localhost:3000/delete/${message.time}`);
  } else {
    await fetch(`http://localhost:3000/movetotrash/${message.time}`);
  }
  getMessages(currentTab);
}

function composeMail(index) {
  currentTab = "compose";
  document.querySelector(".rightSection").style.backgroundImage = "none";
  document.querySelector(".active")?.classList.remove("active");
  let messageReciever = index ? data[index].receiver : "";
  let messageTitle = index ? data[index].title : "";
  let messageBody = index
    ? data[index].message.replace(/<br\s*[\/]?>/gi, "\n")
    : "";
  messageId = index ? data[index].time : " ";

  window.sessionStorage.setItem("currentTab", "compose");
  let composeHTML = ` <div class="writeMessage">
  <div class="userAddress">
    <h1>New Message</h1>
  </div>
  <form class="newMailDetails" onsubmit="return sendMail()" autocomplete="off">
    <div class="newMailInfo">
      <div class="fromUser">
        <label for="userAddress">From</label>
        <input type="email" value="${currentUser}" readonly id="sender">
      </div>
      <div class="toUser">
        <label for="userAddress">To</label>
        <input type="email" required list="users" id="receiver" value="${messageReciever}">
        <datalist id="users"></datalist>
      </div>
    </div>
    <div class="header">
      <input type="text" placeholder="Add a Subject" required id="subject" value="${messageTitle}">
    </div>
    <div class="mailbody">
      <textarea name="" id="message"  rows="15" required value="">${messageBody}</textarea>
    </div>
    <button type="submit" class="sendButton">Send</button>
  </form>
</div>`;
  document.querySelector(".rightSection").innerHTML = composeHTML;
  getUsers();
}

async function getUsers() {
  let usersArray = [];
  let data = await fetch("http://localhost:3000/getusers");
  await data.json().then((value) => {
    usersArray = value;
  });
  let datalistHTML = ``;
  usersArray.forEach((element) => {
    if (element != currentUser) {
      datalistHTML += `<option value="${element}">${element}</option>`;
    }
  });
  document.querySelector("#users").innerHTML = datalistHTML;
}

function checkDraft() {
  let tabValue = currentTab;
  if (currentTab == "compose") {
    let checkArray = [];
    checkArray.push(document.querySelector("#receiver").value);
    checkArray.push(document.querySelector("#subject").value);
    checkArray.push(
      (mailData.message = document.querySelector("#message").value)
    );
    if (checkArray[0].length || checkArray[1].length || checkArray[2].length) {
      sendMail("draft", tabValue);
    }
  }
}
let mailData = {};
function sendMail(draft, tabValue) {
  mailData.sender = document.querySelector("#sender").value;
  mailData.receiver = document.querySelector("#receiver").value;
  mailData.title = document.querySelector("#subject").value;
  mailData.time = moment.now();
  mailData.message = document
    .querySelector("#message")
    .value.replace(/\n\r?/g, "<br />");
  mailData.status = "unread";
  mailData.delete = false;
  if (draft) {
    mailData.oldId = messageId;
    mailData.draft = true;
  }
  storeMail(mailData, tabValue);
  return false;
}

async function storeMail(mailData, tabValue) {
  await fetch("http://localhost:3000/sendMail", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(mailData),
  })
    .then((res) => res.json())
    .then((value) => {
      if (tabValue == "compose") {
        alert("Draft saved sucessfully");
        getMessages(currentTab);
      } else {
        alert(value.message);
        getMessages("SentBox");
      }
    });
}

async function restore(index) {
  let message = data[index];
  await fetch(`http://localhost:3000/restore/${message.time}`);
  getMessages(currentTab);
}

function logOut() {
  window.sessionStorage.clear();
  location.href = "login.html";
}
