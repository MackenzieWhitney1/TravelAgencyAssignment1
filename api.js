// VARIABLES
const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const app = express();
const select = require("./public/modules/sqlFunctions.js");
const connection = require("./public/modules/connection.js");
const keyFile = fs.readFileSync("./jsonToken/privateKey.json", "utf8");
const keys = JSON.parse(keyFile);

// APP SETTINGS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SENDS PACKAGES
router.get("/admin", async (req, res) => {
  const data = await select("*", "packages");
  res.status(200).json(data);
});

// SENDS PACKAGES
router.get("/home", async (req, res) => {
  const data = await select("*", "packages");
  res.status(200).json(data);
});

// SENDS AGENTS
router.get("/register", async (req, res) => {
  const data = await select("*", "agents");
  res.status(200).json(data);
});

// SENDS PACKAGES BASED OFF USERID IN COOKIE/TOKEN
router.get("/profile", async (req, res) => {
  const token = req.headers.cookie.split("token=")[1];
  const decoded = jwt.verify(token, keys.primaryKey);
  const data = await select(
    "CustFirstName",
    "customers",
    `CustomerId=${decoded.userid}`
  );
  const sql =
    "SELECT * FROM `bookings` JOIN `bookingdetails` ON bookings.BookingId=bookingdetails.BookingDetailId WHERE bookings.CustomerId=" +
    decoded.userid;
  connection.query(sql, (err, results) => {
    res.status(200).json({ trips: results, name: data[0].CustFirstName });
  });
});

// SENDS AGENCIES
router.get("/contactAgencies", async (req, res) => {
  const data = await select("*", "agencies");
  res.status(200).json(data);
});

// SENDS AGENTS
router.get("/contactAgents", async (req, res) => {
  const data = await select(
    "AgencyId, AgtFirstName, AgtLastName, AgtBusPhone",
    "agents"
  );
  res.status(200).json(data);
});

// SENDS A WHOLE THWACK OF DATA BASED ON BOOKINGID. USED FOR TRIP PAGE
router.post("/trip", (req, res) => {
  // IF TRIPID === STRING, RETURN 'bookings.BookingId=368' ELSE return 'bookings.BookingId=1 OR bookings.BookingId=2'...
  const whereClause =
    typeof req.body.tripId === "string"
      ? `bookings.BookingId=${req.body.tripId}`
      : req.body.tripId.reduce((acc, cur, i) => {
          return (acc +=
            i === req.body.tripId.length - 1
              ? `bookings.BookingId=${cur}`
              : `bookings.BookingId=${cur} OR `);
        }, "");

  const sql =
    "SELECT Destination, BookingDate, TripStart, TripEnd, Description, BasePrice, AgencyCommission, SupConFirstName, SupConLastName, SupConCompany, SupConBusPhone, SupConEmail, ProdName, TTName, CCName, CCNumber, CCExpiry, AgtFirstName, AgtLastName, AgtBusPhone, AgtEmail, AgtPosition, CustFirstName, CustLastName FROM bookings JOIN bookingdetails ON bookings.BookingId=bookingdetails.BookingId JOIN Customers ON bookings.CustomerId=customers.CustomerId JOIN products_suppliers ON bookingdetails.ProductSupplierId=products_suppliers.ProductSupplierId JOIN products ON products_suppliers.ProductId=products.ProductId JOIN suppliercontacts ON products_suppliers.SupplierId=suppliercontacts.SupplierId JOIN triptypes ON bookings.TripTypeId=triptypes.TripTypeId JOIN creditcards ON customers.CustomerId=creditcards.CustomerId JOIN agents ON customers.AgentId=agents.AgentId WHERE " +
    whereClause;
  connection.query(sql, (err, result) => {
    res.status(200).json(result);
  });
});

// REGISTERS A USER
router.post("/register", async (req, res) => {
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

// VERIFIES CREDENTIALS, CREATES TOKEN/ REDIRECTS
router.post("/sign-in", async (req, res) => {
  res.clearCookie("token");
  const data = await select(
    "*",
    "customers",
    `username="${req.body.username}"`
  );

  if (data[0] === undefined) {
    res.json({ user: false, password: false });
  } else if (await argon2.verify(data[0].Password, req.body.password)) {
    const keyFile = fs.readFileSync("./jsonToken/privateKey.json", "utf8");
    const keys = JSON.parse(keyFile);
    const token = jwt.sign(
      {
        userid: data[0].CustomerId,
        user: req.body.username,
        isAdmin: data[0].isAdmin === 0 ? false : true,
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

module.exports = router;
