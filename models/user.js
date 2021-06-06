const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const db = require("../utils/database");

module.exports.GetAll = () => {
	return new Promise((resolve, reject) => {
		db.getConnection((error, connection) => {
			if (error) {
				console.log(`Error getting connection ${error.stack}`);
				reject(error);
			}

			connection.query("SELECT * FROM accounts", (error, results) => {
				if (error) {
					console.log(`Error executing query ${error.stack}`);
					reject(error);
				}

				connection.release();
				resolve(results);
			});
		});
	});
};

module.exports.GetByEmail = (email) => {
	return new Promise((resolve, reject) => {
		db.getConnection((error, connection) => {
			if (error) {
				console.log(`Error getting connection ${error.stack}`);
				reject(error);
			}

			connection.query(
				"SELECT * FROM accounts WHERE email = ?",
				[email],
				(error, results) => {
					if (error) {
						console.log(`Error executing query ${error.stack}`);
						reject(error);
					}

					connection.release();
					resolve(results[0]);
				}
			);
		});
	});
};

module.exports.GetById = (id) => {
	return new Promise((resolve, reject) => {
		db.getConnection((error, connection) => {
			if (error) {
				console.log(`Error getting connection ${error.stack}`);
				reject(error);
			}

			connection.query(
				"SELECT * FROM accounts WHERE id = ?",
				[id],
				(error, results) => {
					if (error) {
						console.log(`Error executing query ${error.stack}`);
						reject(error);
					}

					connection.release();
					resolve(results[0]);
				}
			);
		});
	});
};

module.exports.GetByAccount = (account) => {
	return new Promise((resolve, reject) => {
		db.getConnection((error, connection) => {
			if (error) {
				console.log(`Error getting connection ${error.stack}`);
				reject(error);
			}

			connection.query(
				"SELECT * FROM accounts WHERE name = ?",
				[account],
				(error, results) => {
					if (error) {
						console.log(`Error executing query ${error.stack}`);
						reject(error);
					}

					connection.release();
					resolve(results);
				}
			);
		});
	});
};

module.exports.Register = ({ name, password, email }) => {
	return new Promise((resolve, reject) => {
		db.getConnection((error, connection) => {
			if (error) {
				console.log(`Error getting connection ${error.stack}`);
				reject(error);
			}

			bcrypt.hash(password, 8, (error, hash) => {
				if (error) {
					console.log(`Error hashing password ${error.stack}`);
					reject(error);
				}

				connection.query(
					"INSERT INTO accounts SET ? ",
					[{ name, password: hash, email }],
					(error, results) => {
						if (error) {
							console.log(`Error executing query ${error.stack}`);
							reject(error);
						}
						connection.release();
						resolve(results[0]);
					}
				);
			});
		});
	});
};

module.exports.Login = async (res, { email, password }) => {
	const user = await this.GetByEmail(email);

	if (!user) {
		return res.json({
			error: "Error, email or password incorrect",
		});
	}

	bcrypt.compare(password, user.password, async (error, result) => {
		if (error || !result) {
			return res.json({
				error: "Error, email or password incorrect",
			});
		}

		const token = this.CreateToken(user);

		res.cookie(
			"access-token",
			token,
			require("../config/cookiesConfig").cookieConfig
		);

		return res.redirect("/");
	});
};

module.exports.CreateToken = (user) => {
	let payload = {
		userId: user.id,
		role: user.role,
		createdAt: moment().unix(),
		expiresAt: moment().add(process.env.JWT_TOKEN_EXPIRES, "m").unix(),
	};

	return jwt.sign(payload, process.env.JWT_SECRET);
};