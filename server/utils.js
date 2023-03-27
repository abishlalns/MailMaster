import * as data from "../dataBase/users.json" assert { type: "json" };
import * as messages from "../dataBase/messages.json" assert { type: "json" };

import fs from "fs";

const dataValue = Object.keys(data.default);

export function loginCheck(loginCredentials) {
  let login = {};
  let email = loginCredentials.email;
  let password = loginCredentials.password;
  let dataEmail = data.default[email] ? data.default[email].email : null;
  let dataPassword = data.default[email] ? data.default[email].password : null;

  if (email == dataEmail && password == dataPassword) {
    login.email = true;
    login.password = true;
    login.currentUser = dataEmail;
  } else if (email == dataEmail && password != dataPassword) {
    login.email = true;
    login.password = false;
  } else {
    login.email = false;
    login.password = false;
  }
  return login;
}

let userMessage = {};
export function createUser(userCredentials) {
  let userDB = fs.readFileSync("./dataBase/users.json");
  userDB = JSON.parse(userDB);
  let mail = userCredentials.email;
  userDB[mail] = userCredentials;
  let stringifiedDB = JSON.stringify(userDB);
  if (dataValue.includes(mail)) {
    userMessage.message = "User already exists";
    userMessage.signup = false;
  } else {
    fs.writeFile("./dataBase/users.json", stringifiedDB, (err) => {
      console.log(err);
    });
    userMessage.message = "Signed up sucessfully";
    userMessage.signup = true;
  }
  return userMessage;
}

export function getUsers() {
  return Object.keys(data.default);
}

export function storeMail(mailData) {
  let userDB = fs.readFileSync("./dataBase/messages.json");
  userDB = JSON.parse(userDB);
  let time = mailData.time;
  delete userDB[mailData.oldId]
  userDB[time] = mailData;
  let stringifiedDB = JSON.stringify(userDB);

  fs.writeFile("./dataBase/messages.json", stringifiedDB, (err) => {
    console.log(err);
  });
  userMessage.message = "Message Sent Sucessfully";
  return userMessage;
}
