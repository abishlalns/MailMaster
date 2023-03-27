import { Router } from "express";
const getMessageRouter = Router();

import { readFileSync } from "fs";

getMessageRouter.get("/:type/:user", (req, res) => {
  let type = req.params.type;
  let user = req.params.user;
  res.send(getMessages(type, user));
});

function getMessages(type, user) {
  const rawData = readFileSync("./dataBase/messages.json");
  let arrayData = Object.values(JSON.parse(rawData));
  let dataValue = [];
  arrayData.sort((a, b) => (a.time < b.time ? 1 : -1));
  arrayData.forEach((element) => {
    if (type == "Inbox" && element.receiver == user && !element.delete) {
      dataValue.push(element);
    } else if (type == "SentBox" && element.sender == user && !element.delete && !element.draft) {
      dataValue.push(element);
    }
    else if(type == "Unread" && element.receiver == user && !element.delete && element.status == "unread"){
      dataValue.push(element);
    } else if (
      type == "Trash" &&
      element.delete &&
      (element.sender == user || element.receiver == user)
    ) {
      dataValue.push(element);
    }
    else if(type == "Draft" && element.sender == user && element.draft && !element.delete){
      dataValue.push(element);
    }
  });
  return dataValue;
}

export default getMessageRouter;
