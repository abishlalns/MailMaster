import { Router } from "express";
const restore = Router();

import fs from "fs";

restore.get("/:userid", (req, res) => {
  let userid = req.params.userid;
  toRestore(userid);
  res.sendStatus(200);
});

function toRestore(userid) {
  const rawData = fs.readFileSync("./dataBase/messages.json");
  let arrayData = JSON.parse(rawData);
  arrayData[userid].delete = false;
  let stringifiedDB = JSON.stringify(arrayData);
  fs.writeFile("./dataBase/messages.json", stringifiedDB, (err) => {
    console.log(err);
  });
}

export default restore;
