let userCredentials = {};
let errorDisplay = document.querySelector(".errorMessage");
let errorMessage = document.querySelector(".error");
function onSubmit() {
  userCredentials.user = document.querySelector("#username").value;
  userCredentials.email = document.querySelector("#email").value + '@mastermail.com';
  userCredentials.password = document.querySelector("#password").value;
  console.log(userCredentials.email)
  let domain = userCredentials.email.split("@");
  if (domain[1] == "mastermail.com") {
    sendData(userCredentials);
  } else {
    errorDisplay.style.visibility = "visible";
    errorMessage.innerText = "The domain name should be 'mastermail.com'";
  }
  return false;
}

errorDisplay.style.visibility = "hidden";
async function sendData(userCredentials) {
  let userData = await fetch("http://localhost:3000/create/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userCredentials),
  });
  userData.json().then((res) => {
    if (res.signup) {
      errorDisplay.style.visibility = "visible";
      errorMessage.innerText = res.message;
      location.href = `index.html?user=${userCredentials.email}`;
      window.sessionStorage.setItem("userEmail", userCredentials.email);
      window.sessionStorage.setItem("currentTab", "Inbox");
    } else {
      errorDisplay.style.visibility = "visible";
      errorMessage.innerText = res.message;
    }
  });
}
