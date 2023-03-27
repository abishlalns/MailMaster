import { Router } from "express";
const deleteMessages = Router();

import fs from "fs";

const rawData = fs.readFileSync("./dataBase/messages.json");
let arrayData = JSON.parse(rawData);
deleteMessages.get("/:userid", (req, res) => {
  let userid = req.params.userid;
  console.log(userid)
  delete arrayData[userid];
  let stringifiedDB = JSON.stringify(arrayData);
  fs.writeFile("./dataBase/messages.json", stringifiedDB, (err) => {
    console.log(err);
  });
  res.sendStatus(200);
});

export default deleteMessages;
