import { Router } from "express";
const setStatus = Router();

import fs from "fs";

setStatus.get("/:status", (req, res) => {
  let status = req.params.status;
  updateStatus(status);
  res.sendStatus(200)
});

function updateStatus(status) {
  const rawData = fs.readFileSync("./dataBase/messages.json");
  let arrayData = JSON.parse(rawData);
  arrayData[status].status = "read";
  let stringifiedDB = JSON.stringify(arrayData);
  fs.writeFile("./dataBase/messages.json", stringifiedDB, (err) => {
    console.log(err);
  });
}

export default setStatus;
