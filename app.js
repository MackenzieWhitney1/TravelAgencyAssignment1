// VARIABLES
const express = require("express");
const app = express();
const api = require("./api.js");
const verifyToken = require("./public/modules/verifyToken");

// APP SETUP
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/styles"));
app.use(express.static(__dirname + "/Images"));

// API ROUTE
app.use("/api", api);

const port = 8000;

// GET REQUESTS FOR FILES
app.get(["/", "/home"], (req, res) => {
  res.clearCookie("token");
  res.status(200).sendFile(__dirname + "/views/home.html");
});

app.get("/contact", (req, res) => {
  res.clearCookie("token");
  res.status(200).sendFile(__dirname + "/views/contact.html");
});

app.get("/register", (req, res) => {
  res.clearCookie("token");
  res.status(200).sendFile(__dirname + "/views/register.html");
});

app.get("/confirm", (req, res) => {
  res.status(200).sendFile(__dirname + "/views/confirm.html");
});

app.get("/admin", verifyToken, (req, res) => {
  res.status(200).sendFile(__dirname + "/views/admin.html");
});

app.get("/profile/", verifyToken, (req, res) => {
  res.status(200).sendFile(__dirname + "/views/profile.html");
});

app.get("/profile/trip/:tripId&:img", (req, res) => {
  res.status(200).sendFile(__dirname + "/views/trip.html");
});

app.get("/profile/book-trip", verifyToken, (req, res) => {
  res.status(200).sendFile(__dirname + "/views/book-trip2.html");
});

app.get("/sign-in", (req, res) => {
  res.status(200).sendFile(__dirname + "/views/sign-in.html");
});

app.get("/sign-out", (req, res) => {
  res.clearCookie("token");
  res.status(200).redirect("/sign-in");
});

app.get("/access-denied", (req, res) => {
  res.status(200).sendFile(__dirname + "/views/noAccess.html");
});

app.listen(port, (req, res) => {
  console.log(`Server is listening`);
});
