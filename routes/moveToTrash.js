import { Router } from "express";
const moveToTrash = Router();

import fs from "fs";

moveToTrash.get("/:userid", (req, res) => {
  let userid = req.params.userid;
  toTrash(userid);
  res.sendStatus(200);
});

function toTrash(userid) {
  const rawData = fs.readFileSync("./dataBase/messages.json");
  let arrayData = JSON.parse(rawData);
  arrayData[userid].delete = true;
  let stringifiedDB = JSON.stringify(arrayData);
  fs.writeFile("./dataBase/messages.json", stringifiedDB, (err) => {
    console.log(err);
  });
}

export default moveToTrash;
