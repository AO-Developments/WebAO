const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const db = require("../utils/database");

const Logger =
	require("simple-node-logger").createSimpleLogger("./logs/project.log");

module.exports.GetAll = () => {
	return new Promise((resolve, reject) => {
		db.getConnection((error, connection) => {
			if (error) {
				Logger.log(
					"error",
					`[ DATE ] ${moment().format("YYYY/MM/DD")} [ ACTION ] GETALL [ MESSAGE ] ${
						error.message
					} [ STACK ] ${error.stack}`
				);
				reject(error);
			}

			connection.query("SELECT * FROM accounts", (error, results) => {
				if (error) {
					Logger.log(
						"error",
						`[ DATE ] ${moment().format(
							"YYYY/MM/DD"
						)} [ ACTION ] SELECT [ MESSAGE ] ${error.message} [ STACK ] ${
							error.stack
						}`
					);
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
				Logger.log(
					"error",
					`[ DATE ] ${moment().format(
						"YYYY/MM/DD"
					)} [ ACTION ] GETBYEMAIL [ MESSAGE ] ${error.message} [ STACK ] ${
						error.stack
					}`
				);
				reject(error);
			}

			connection.query(
				"SELECT * FROM accounts WHERE email = ?",
				[email],
				(error, results) => {
					if (error) {
						Logger.log(
							"error",
							`[ DATE ] ${moment().format(
								"YYYY/MM/DD"
							)} [ ACTION ] SELECT [ MESSAGE ] ${error.message} [ STACK ] ${
								error.stack
							}`
						);
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
				Logger.log(
					"error",
					`[ DATE ] ${moment().format(
						"YYYY/MM/DD"
					)} [ ACTION ] GETBYID [ MESSAGE ] ${error.message} [ STACK ] ${
						error.stack
					}`
				);
				reject(error);
			}

			connection.query(
				"SELECT * FROM accounts WHERE id = ?",
				[id],
				(error, results) => {
					if (error) {
						Logger.log(
							"error",
							`[ DATE ] ${moment().format(
								"YYYY/MM/DD"
							)} [ ACTION ] SELECT [ MESSAGE ] ${error.message} [ STACK ] ${
								error.stack
							}`
						);
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
				Logger.log(
					"error",
					`[ DATE ] ${moment().format(
						"YYYY/MM/DD"
					)} [ ACTION ] GETBYACCOUNT [ MESSAGE ] ${error.message} [ STACK ] ${
						error.stack
					}`
				);
				reject(error);
			}

			connection.query(
				"SELECT * FROM accounts WHERE name = ?",
				[account],
				(error, results) => {
					if (error) {
						Logger.log(
							"error",
							`[ DATE ] ${moment().format(
								"YYYY/MM/DD"
							)} [ ACTION ] SELECT [ MESSAGE ] ${error.message} [ STACK ] ${
								error.stack
							}`
						);
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
				Logger.log(
					"error",
					`[ DATE ] ${moment().format(
						"YYYY/MM/DD"
					)} [ ACTION ] GETCONNECTION [ MESSAGE ] ${error.message} [ STACK ] ${
						error.stack
					}`
				);
				reject(error);
			}

			bcrypt.hash(password, 8, (error, hash) => {
				if (error) {
					Logger.log(
						"error",
						`[ DATE ] ${moment().format("YYYY/MM/DD")} [ ACTION ] HASH [ MESSAGE ] ${
							error.message
						} [ STACK ] ${error.stack}`
					);
					reject(error);
				}
				console.log(name);
				connection.query(
					"INSERT INTO accounts SET ? ",
					[{ name, password: hash, email }],
					(error, results) => {
						if (error) {
							Logger.log(
								"error",
								`[ DATE ] ${moment().format(
									"YYYY/MM/DD"
								)} [ ACTION ] INSERT [ MESSAGE ] ${error.message} [ STACK ] ${
									error.stack
								}`
							);
							reject(error);
						}
						connection.release();
						Logger.log(
							"info",
							`[ ACCOUNT ] ${email} [ ACTION ] REGISTER [ DATE ] ${moment().format(
								"YYYY/MM/DD"
							)}`
						);
						resolve(results);
					}
				);
			});
		});
	});
};

module.exports.Login = async (res, { email, password }) => {
	const user = await this.GetByEmail(email);

	if (!user) {
		return res.render("pages/user/login", {
			message: "Email or password incorrect. Please try again.",
		});
	}

	bcrypt.compare(password, user.password, async (error, result) => {
		if (error || !result) {
			return res.render("pages/user/login", {
				message: "Email or password incorrect. Please try again.",
			});
		}

		let token = await this.CreateToken(user);

		res.setHeader("Access-Control-Allow-Credentials", true);
		res.cookie("access-token", token, {
			expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 60 * 1000),
			httpOnly: true,
			secure: false,
		});

		Logger.log(
			"info",
			`[ DATE ] ${moment().format("YYYY/MM/DD")} [ ACCOUNT ] ${
				user.id
			} [ ACTION ] LOGGIN`
		);
		return res.redirect("/");
	});
};

module.exports.CreateToken = (user) => {
	let payload = {
		id: user.id,
		name: user.name,
		role: user.role,
		createdAt: moment().unix(),
		expiresAt: moment().add(process.env.JWT_TOKEN_EXPIRES, "m").unix(),
	};

	return jwt.sign(payload, process.env.JWT_SECRET);
};

module.exports.GetCharacters = (id) => {
	return new Promise((resolve, reject) => {
		db.getConnection((error, connection) => {
			if (error) {
				Logger.log(
					"error",
					`[ DATE ] ${moment().format(
						"YYYY/MM/DD"
					)} [ ACTION ] GETCHARACTERS [ MESSAGE ] ${error.message} [ STACK ] ${
						error.stack
					}`
				);
				reject(error);
			}

			connection.query(
				"SELECT username FROM characters WHERE account_id = ?",
				[id],
				(error, results) => {
					if (error) {
						Logger.log(
							"error",
							`[ DATE ] ${moment().format(
								"YYYY/MM/DD"
							)} [ ACTION ] SELECT [ MESSAGE ] ${error.message} [ STACK ] ${
								error.stack
							}`
						);
						reject(error);
					}

					connection.release();
					resolve(results);
				}
			);
		});
	});
};
