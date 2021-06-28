const db = require("../utils/database");
const moment = require("moment");

const Logger =
	require("simple-node-logger").createSimpleLogger("./logs/project.log");

module.exports.GetAll = () => {
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

			connection.query(
				"SELECT * FROM posts ORDER BY post_date DESC",
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

module.exports.GetByPage = (page) => {
	const perPage = 3;
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

			connection.query(
				`SELECT * FROM posts ORDER BY post_date DESC LIMIT ${
					page * perPage
				}, ${perPage}`,
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

module.exports.GetById = (id) => {
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

			connection.query(
				"SELECT * FROM posts WHERE id = ?",
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

module.exports.GetByUserID = (userID) => {
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

			connection.query(
				"SELECT * FROM posts WHERE userID = ?",
				[userID],
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

module.exports.SubmitPost = ({ owner_id, title, body }) => {
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

			connection.query(
				"INSERT INTO posts SET ? ",
				[{ owner_id, title, body }],
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
						`[ DATE ] ${moment().format(
							"YYYY/MM/DD"
						)} [ ACTION ] POSTSUBMIT [ OWNER ] ${owner_id} [ TITLE ] ${title}`
					);
					resolve(results[0]);
				}
			);
		});
	});
};
