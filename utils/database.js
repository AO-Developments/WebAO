const mysql = require("mysql");

require("dotenv").config();

var pool = mysql.createPool({
	host: process.env.DATABASE_HOST,
	port: process.env.DATABASE_PORT,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: "ao_db",
});

module.exports = pool;
