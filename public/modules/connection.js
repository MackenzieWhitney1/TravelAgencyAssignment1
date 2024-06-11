const mySql = require("mysql");

const port = 8000;

const connection = mySql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "travelexperts",
});

connection.connect((err) => {
  if (err) throw err;
  console.log(`Connection established`);
});

module.exports = connection;
