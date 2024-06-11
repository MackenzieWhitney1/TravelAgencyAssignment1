const mySql = require("mysql");

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

module.exports = select;
