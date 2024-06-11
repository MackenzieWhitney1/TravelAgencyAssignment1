const express = require("express");
const app = express();
const mySql = require("mysql");
const api = require("./api.js");
const verifyToken = require("./public/modules/verifyToken");
const connection = require("./public/modules/connection.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/styles"));
app.use(express.static(__dirname + "/Images"));
app.use("/api", api);

const port = 8000;

app.get(["/", "/home"], (req, res) => {
  res.status(200).sendFile(__dirname + "/views/home.html");
});

app.get("/contact", (req, res) => {
  res.status(200).sendFile(__dirname + "/views/contact.html");
});

app.get("/register", (req, res) => {
  res.status(200).sendFile(__dirname + "/views/register.html");
});

app.get("/confirm", (req, res) => {
  res.status(200).sendFile(__dirname + "/views/confirm.html");
});

app.get("/admin", verifyToken, (req, res) => {
  res.status(200).sendFile(__dirname + "/views/admin.html");
});

app.get("/profile", verifyToken, (req, res) => {
  res.status(200).sendFile(__dirname + "/views/profile.html");
});

app.get("/sign-in", (req, res) => {
  res.status(200).sendFile(__dirname + "/views/sign-in.html");
});

app.get("/access-denied", (req, res) => {
  res.status(200).sendFile(__dirname + "/views/noAccess.html");
});

app.listen(port, (req, res) => {
  console.log(`Server is listening`);
});
