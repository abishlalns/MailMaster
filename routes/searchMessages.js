import { Router } from "express";
const searchMessages = Router();

import { readFileSync } from "fs";

searchMessages.get("/:value/:user", (req, res) => {
  let value = req.params.value;
  let user = req.params.user;
  res.send(getMessages(value, user));
});

function getMessages(value, user) {
  const rawData = readFileSync("./dataBase/messages.json");
  let arrayData = Object.values(JSON.parse(rawData));
  let dataValue = [];
  arrayData.sort((a, b) => (a.time < b.time ? 1 : -1));

  let results = [];
  let checkData = ["sender", "receiver", "title", "message"];
  for (var i = 0; i < arrayData.length; i++) {
    checkData.forEach((element) => {
      let keyValue = arrayData[i][element].toString();
      if (
        keyValue.indexOf(value) != -1 &&
        (arrayData[i].sender == user || arrayData[i].receiver == user)
      ) {
        results.push(arrayData[i]);
      }
    });
  }
  return results;
}

export default searchMessages;
