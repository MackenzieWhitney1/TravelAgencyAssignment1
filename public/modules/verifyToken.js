// GAVIN
// VARIABLES
const jwt = require("jsonwebtoken");
const fs = require("fs");

// READS KEY FILE
const keyFile = fs.readFileSync("./jsonToken/privateKey.json", "utf8");
const keys = JSON.parse(keyFile);

// VERIFIES TOKEN, CHECKS TO SEE IF COOKIE/TOKEN EXISTS, IF NOT REDIRECTS TO SIGN-IN. IF THE TOKEN DOES EXIST, CHECKS TO SEE IF THE KEY MATCHES KEY FILE
const verifyToken = function (req, res, next) {
  const cookies = req.headers.cookie;
  if (!cookies) return res.status(401).redirect("/sign-in");
  const token = cookies.split("token=")[1];
  if (!token) return res.status(401).redirect("/sign-in");
  try {
    const decoded = jwt.verify(token, keys.primaryKey);
    req.username = decoded.username;
    if (
      req.url === "/profile" ||
      req.url === "/profile/book-trip" ||
      req.url === "/profile/book-trip2"
    ) {
      next();
    } else {
      decoded.isAdmin ? next() : res.status(401).redirect("/sign-in");
    }
  } catch (err) {
    res.status(401).redirect("/sign-in");
  }
};

module.exports = verifyToken;
