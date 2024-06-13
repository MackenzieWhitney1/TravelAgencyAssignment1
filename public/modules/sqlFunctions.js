// GAVIN
const mySql = require("mysql");
const connection = mySql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "travelexperts",
});

//SELECT FUNCTION. RETURNS SELECT QUERY
connection.connect((err) => {
  if (err) throw err;
  console.log(`API Connection established`);
});

const select = function (attribute, table, options) {
  return new Promise(function (resolve, reject) {
    let sql = `SELECT ${attribute} FROM ${table} ${
      options ? "WHERE " + options : ""
    }`;
    connection.query(sql, function (err, response) {
      if (err) return reject(err);
      resolve(Object.values(JSON.parse(JSON.stringify(response))));
    });
  });
};

// INSERT FUNCTION, RETURNS INSERT QUERY
const insert = function (sql, values) {
  return new Promise((resolve, reject) => {
    connection.query(sql, values, (err, response) => {
      if (err) reject(err);
      resolve(response);
    });
  });
};

// GET PACKAGES FUNCTION
const getPackages = function (where) {
  return new Promise((resolve, reject) => {
    let sql = `SELECT * FROM packages ${where ? "WHERE " + where : ""}`;
    connection.query(sql, (err, response) => {
      if (err) reject(err);
      resolve(response);
    });
  });
};

module.exports = { select, insert, getPackages };
