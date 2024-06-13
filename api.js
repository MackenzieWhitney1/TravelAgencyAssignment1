// VARIABLES
const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const app = express();
const {
  select,
  insert,
  getPackages,
} = require("./public/modules/sqlFunctions.js");
const connection = require("./public/modules/connection.js");
const keyFile = fs.readFileSync("./jsonToken/privateKey.json", "utf8");
const keys = JSON.parse(keyFile);

// APP SETTINGS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SENDS PACKAGES
router.get("/admin", async (req, res) => {
  const data = await getPackages();
  res.status(200).json(data);
});

// SENDS PACKAGES
router.get("/home", async (req, res) => {
  const data = await getPackages();
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
    "SELECT * FROM `bookings` JOIN `bookingdetails` ON bookings.BookingId=bookingdetails.BookingId WHERE bookings.CustomerId=" +
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
router.post("/trip", async (req, res) => {
  // IF TRIPID === STRING, RETURN 'bookings.BookingId=368' ELSE return 'bookings.BookingId=1 OR bookings.BookingId=2'...
  const tripId =
    typeof req.body.tripId === "string"
      ? [...req.body.tripId]
      : req.body.tripId;

  // FILTERS OUT DUPLICATE TRIP IDS
  const filteredTrips = tripId.reduce((acc, cur, i) => {
    if (!acc.includes(cur)) {
      acc.push(cur);
    }
    return acc;
  }, []);

  // TURNS TRIPS ID'S INTO SQL
  const whereClause =
    typeof req.body.tripId === "string"
      ? `bookings.BookingId=${req.body.tripId}`
      : filteredTrips.reduce((acc, cur, i) => {
          return (acc +=
            i === req.body.tripId.length - 1
              ? `bookings.BookingId=${cur}`
              : `bookings.BookingId=${cur} OR `);
        }, "");

  const sql =
    "SELECT Destination, BookingDate, TripStart, TripEnd, Description, BasePrice, AgencyCommission, SupConFirstName, SupConLastName, SupConCompany, SupConBusPhone, SupConEmail, ProdName, TTName, CCName, CCNumber, CCExpiry, AgtFirstName, AgtLastName, AgtBusPhone, AgtEmail, AgtPosition, CustFirstName, CustLastName FROM bookings JOIN bookingdetails ON bookings.BookingId=bookingdetails.BookingId JOIN Customers ON bookings.CustomerId=customers.CustomerId JOIN products_suppliers ON bookingdetails.ProductSupplierId=products_suppliers.ProductSupplierId JOIN products ON products_suppliers.ProductId=products.ProductId JOIN suppliercontacts ON products_suppliers.SupplierId=suppliercontacts.SupplierId JOIN triptypes ON bookings.TripTypeId=triptypes.TripTypeId JOIN creditcards ON customers.CustomerId=creditcards.CustomerId JOIN agents ON customers.AgentId=agents.AgentId WHERE SupConFirstName IS NOT NULL AND SupConLastName IS NOT NULL AND SupConBusPhone IS NOT NULL AND SupConEmail IS NOT NULL AND SupConCompany IS NOT NULL AND " +
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

router.get("/book-trip", async (req, res) => {
  const packages = await getPackages();
  const tripTypes = await select("*", "triptypes");
  const regions = await select("*", "regions");
  const classes = await select("*", "classes");
  const products = await select("*", "products");
  res.status(200).json({ packages, tripTypes, regions, classes, products });
});

router.post("/book-trip", async (req, res) => {
  const data = req.body;
  const date = new Date();
  const [...product] = data.productId;
  const token = req.headers.cookie.split("token=")[1];
  const decoded = jwt.verify(token, keys.primaryKey);
  const bookingValues = [
    date,
    data.bookingNumber,
    data.travelerCountInput,
    decoded.userid,
    data.tripTypes,
    data.tripSelector,
  ];

  const sqlBooking =
    "INSERT INTO `bookings` (`BookingId`, `BookingDate`, `BookingNo`, `TravelerCount`, `CustomerId`,  `TripTypeId`, `PackageId`) \
    VALUES (null,?,?,?,?,?,?);";

  // INSERTS THE BOOKING INTO `bookings` AND THEN SELECTS THE BOOKING ID AFTERINSERTING
  const bookingId = await insert(sqlBooking, bookingValues).then(
    async (res) => {
      const bookingId = await select(
        "*",
        "bookings",
        `CustomerId=${decoded.userid} ORDER BY BookingDate DESC LIMIT 1`
      );
      return bookingId[0].BookingId;
    }
  );

  const package = await getPackages(`packages.PackageId=${data.tripSelector}`);

  const sqlCC =
    "INSERT INTO creditcards (CreditCardId, CCName, CCNumber, CCExpiry, CustomerId) VALUES (null,?,?,?,?)";
  const ccValues = [data.CCName, data.CCNumber, data.CCExpiry, decoded.userid];
  insert(sqlCC, ccValues);

  // FOR EACH PRODUCT, INSERTS INTO BOOKINGDETAILS
  product.forEach(async (product) => {
    const productSupplier = {
      1: 5492,
      2: 6873,
      3: 9396,
      4: 1005,
      5: 5228,
      6: 1620,
      7: 828,
      8: 1040,
      9: 2998,
      10: 2386,
    };

    const queriedProductId = await select(
      "ProductSupplierId",
      "products_suppliers",
      `SupplierId=${productSupplier[product]}`
    );

    console.log(queriedProductId);

    const sqlBookingDetailsValues = [
      data.itineraryNo,
      data.tripStart,
      data.tripEnd,
      data.description,
      data.destination,
      package[0].PkgBasePrice,
      package[0].PkgAgencyCommission,
      bookingId,
      data.regionSelector,
      data.classSelector,
      "BK",
      queriedProductId[0].ProductSupplierId,
    ];
    const sqlBookingDetails =
      "INSERT INTO bookingdetails (`BookingDetailId`,	`ItineraryNo`,	`TripStart`,	`TripEnd`,	`Description`,	`Destination`, `BasePrice`,	`AgencyCommission`, `BookingId`, `RegionId`, `ClassId`, `FeeId`, `ProductSupplierId`) VALUES (null,?,?,?,?,?,?,?,?,?,?,?,?);";
    insert(sqlBookingDetails, sqlBookingDetailsValues);
  });
  res.status(200).redirect("/profile");
});

// sends packages to book trip page selector
// router.get("/book-trip-packages", async (req, res) => {
//   const data = await select(
//     "PackageId, PkgName",
//     "packages",
//     "PkgStartDate <= PkgEndDate"
//   );
//   res.status(200).json(data);
// });

// // sends trip types to book trip page radio buttons
// router.get("/book-trip-types", async (req, res) => {
//   const data = await select("*", "triptypes");
//   res.status(200).json(data);
// });

// // sends Regions to book trip page selector
// router.get("/book-trip-regions", async (req, res) => {
//   const data = await select("*", "regions");
//   res.status(200).json(data);
// });

// // sends Travel Classes to book trip page selector
// router.get("/book-trip-classes", async (req, res) => {
//   const data = await select("*", "classes");
//   res.status(200).json(data);
// });

// // creates a booking in the table. uses user cookie
// router.post("/book-trip", async (req, res) => {
//   const bookingIdInserted = await insertBooking(req);
//   insertBookingDetails(req, bookingIdInserted);
//   res.redirect("/profile");
// });

// async function insertBooking(req) {
//   return new Promise((resolve, reject) => {
//     const date = new Date();
//     const token = req.headers.cookie.split("token=")[1];
//     const decoded = jwt.verify(token, keys.primaryKey);
//     const bookingValues = [
//       date,
//       req.body["bookingNumber"],
//       req.body["travelerCountInput"],
//       decoded.userid,
//       req.body["tripType"],
//       req.body["tripSelector"],
//     ];
//     const bookingsSql =
//       "INSERT INTO `bookings` \
//       (`BookingId`, `BookingDate`, `BookingNo`, `TravelerCount`, `CustomerId`,  `TripTypeId`, `PackageId`) \
//       VALUES (null,?,?,?,?,?,?);";

//     connection.query(bookingsSql, bookingValues, (err, results) => {
//       if (err) return reject(err);
//       resolve(results.insertId);
//     });
//   });
// }

// async function insertBookingDetails(req, bookingIdInserted) {
//   return new Promise((resolve, reject) => {
//     bookingDetailsValues = [
//       req.body["itineraryNo"],
//       req.body["tripStart"],
//       req.body["tripEnd"],
//       req.body["description"],
//       req.body["destination"],
//       3000, // dummy value Base Price would otherwise come from Packages
//       30, // dummy value AgencyCommission should not be defined by user
//       bookingIdInserted,
//       req.body["regionSelector"],
//       req.body["classSelector"],
//       "BK", // dummy value. FeeIds shouldn't be decided by users
//       1, // dummy value. ProductSupplierId shouldn't be decided by users
//     ];

//     const bookingDetailsSql =
//       "INSERT INTO `bookingdetails` \
//     (`BookingDetailId`,	`ItineraryNo`,	`TripStart`,	`TripEnd`,	`Description`,	`Destination`, `BasePrice`,	`AgencyCommission`, \
//     `BookingId`, `RegionId`, `ClassId`, `FeeId`, `ProductSupplierId`) \
//     VALUES (null, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
//     connection.query(
//       bookingDetailsSql,
//       bookingDetailsValues,
//       (err, results) => {
//         if (err) throw reject(err);
//         resolve(console.log("successful"));
//       }
//     );
//   });
// }

module.exports = router;
// GAVIN
//  RETURNS DATA TO BOOK-TRIP PAGE
