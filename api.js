const express = require("express");
const router = express.Router();
const mySql = require("mysql");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const app = express();

const keyFile = fs.readFileSync("./jsonToken/privateKey.json", "utf8");
const keys = JSON.parse(keyFile);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connection = mySql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "travelexperts",
});

connection.connect((err) => {
  if (err) throw err;
  console.log(`API Connection established`);
});

router.get("/admin", function (req, res) {
  const sql = "SELECT * FROM packages";
  connection.query(sql, function (err, response) {
    res.status(200).json(response);
  });
});

router.get("/register", (req, res) => {
  const sql = "SELECT * FROM agents";
  connection.query(sql, function (err, response) {
    res.status(200).json(response);
  });
});

router.get("/profile", (req, res) => {
  const token = req.headers.cookie.split("token=")[1];
  const decoded = jwt.verify(token, keys.primaryKey);

  const sql = "SELECT * FROM bookings WHERE CustomerId=" + decoded.userid;
  connection.query(sql, function (err, response) {});
});

router.get("/contactAgencies", (req, res) => {
  const sql = "SELECT * FROM agencies;";
  connection.query(sql, function (err, response) {
    res.status(200).json(response);
  })
});

router.get("/contactAgents", (req, res) => {
  const sql = "SELECT AgencyId, AgtFirstName, AgtLastName, AgtBusPhone FROM agents;";
  connection.query(sql, function (err, response) {
    res.status(200).json(response);
  })
});

router.post("/register", async (req, res) => {
  console.log(req.body);
  console.log(req.body["home-tel"]);
  const pass = await argon2.hash(req.body.password);
  const values = [
    req.body["f-name"],
    req.body["l-name"],
    req.body.address,
    req.body.city,
    req.body.province,
    req.body["postal-code"],
    req.body.country,
    req.body["home-tel"],
    req.body["business-tel"],
    req.body.email,
    req.body.agent,
    pass,
    req.body["user-id"],
  ];
  const sql =
    "INSERT INTO `customers` (`CustomerId`, `CustFirstName`, `CustLastName`, `CustAddress`,  `CustCity`, `CustProv`, `CustPostal`, `CustCountry`, `CustHomePhone`, `CustBusPhone`, `CustEmail`, `AgentId`, `Password`, `username`) VALUES (null,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  connection.query(sql, values, (err, results) => {
    if (err) {
      throw err;
    } else {
      res.redirect("/confirm");
    }
  });
});

router.post("/sign-in", async (req, res) => {
  const sql =
    `SELECT * FROM customers WHERE username=` + `'${req.body.username}'`;

  connection.query(sql, async (err, response) => {
    console.log(response);
    if (response[0] === undefined) {
      res.json({ user: false, password: false });
    } else if (await argon2.verify(response[0].Password, req.body.password)) {
      const keyFile = fs.readFileSync("./jsonToken/privateKey.json", "utf8");
      const keys = JSON.parse(keyFile);
      const token = jwt.sign(
        {
          userid: response[0].CustomerId,
          user: req.body.username,
          isAdmin: response[0].isAdmin === 0 ? false : true,
        },
        keys.primaryKey,
        {
          expiresIn: "1h",
        }
      );

      res.json({ user: true, password: true, token });
    } else {
      res.json({ user: true, password: false });
    }
  });
});

module.exports = router;
