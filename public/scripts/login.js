const loginForm = document.querySelector("#loginForm");
let data = {};

function logIn() {
  let loginCredentials = {};
  loginCredentials.email = document.querySelector("#email").value;
  loginCredentials.password = document.querySelector("#password").value;
  let domain = loginCredentials.email.split("@");
  if (domain[1] == "mastermail.com") {
    getData(loginCredentials);
  } else {
    errorDisplay.style.visibility = "visible";
    errorMessage.innerText = "Bad Email Credential";
  }
  return false;
}

async function getData(loginCredentials) {
  let post_url = await fetch("http://localhost:3000/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginCredentials),
  });
  post_url.json().then((res) => {
    let currentUser = res.currentUser;
    displayError(res, currentUser);
  });
}

let errorDisplay = document.querySelector(".errorMessage");
let errorMessage = document.querySelector(".error");
errorDisplay.style.visibility = "hidden";

function displayError(errorJson, currentUser) {
  let email = errorJson.email;
  let password = errorJson.password;
  if (email && password) {
    errorDisplay.style.visibility = "hidden";
    location.href = `index.html?user=${currentUser}`;
    window.sessionStorage.setItem("userEmail", currentUser);
    window.sessionStorage.setItem("currentTab", "Inbox");
  } else if (email && !password) {
    errorDisplay.style.visibility = "visible";
    errorMessage.innerText = "Kindly check the password";
  } else {
    errorDisplay.style.visibility = "visible";
    errorMessage.innerText = "User not found. kindly check your email id";
  }
}
