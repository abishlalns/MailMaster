import express from "express";
import { loginCheck, createUser, getUsers, storeMail } from "./utils.js";
import getMessageRouter from "../routes/mailRoutes.js";
import moveToTrash from "../routes/moveToTrash.js";
import setStatus from "../routes/setStatus.js";
import deleteMessages from "../routes/deleteMessages.js";
import searchMessages from "../routes/searchMessages.js";
import restore from "../routes/restore.js";
import * as url from "url";

const app = express();
const PORT = 3000 || process.env.PORT;
app.use(express.json());
const __dirname = url.fileURLToPath(new URL("..", import.meta.url));

app.get("/", (req, res) => {
  res.sendFile("public/login.html", { root: __dirname });
});

app.use(express.static("./public"));
app.post("/submit", function (req, res) {
  // Prepare output in JSON format
  let response = {
    email: req.body.email,
    password: req.body.password,
  };
  let login = loginCheck(response);
  res.send(login);
});

app.post("/create/user", (req, res) => {
  res.send(createUser(req.body));
});
app.get("/getusers", (req, res) => {
  res.send(getUsers());
});

app.post("/sendMail", (req, res) => {
  res.send(storeMail(req.body));
});

app.use("/getmessages/", getMessageRouter);
app.use("/status/", setStatus);
app.use("/movetotrash", moveToTrash);
app.use("/delete", deleteMessages);
app.use("/search", searchMessages);
app.use("/restore", restore);

app.get("**", (req, res) => {
  res.sendFile("public/login.html", { root: __dirname });
});
app.listen(PORT);
