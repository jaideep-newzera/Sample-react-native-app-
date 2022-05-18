var mysql = require('mysql');
var util=require("util")

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Lucky12345!",
    database: "mysampleapp"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

const sql =  util.promisify(con.query).bind(con);

module.exports = sql ;