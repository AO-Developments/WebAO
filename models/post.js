const db = require("../utils/database");

module.exports.GetAll = () => {
	return new Promise((resolve, reject) => {
		db.getConnection((error, connection) => {
			if (error) {
				console.log(`Error getting connection ${error.stack}`);
				reject(error);
			}

			connection.query("SELECT * FROM posts", (error, results) => {
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

module.exports.GetById = (id) => {
	return new Promise((resolve, reject) => {
		db.getConnection((error, connection) => {
			if (error) {
				console.log(`Error getting connection ${error.stack}`);
				reject(error);
			}

			connection.query(
				"SELECT * FROM posts WHERE id = ?",
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

module.exports.GetByUserID = (userID) => {
	return new Promise((resolve, reject) => {
		db.getConnection((error, connection) => {
			if (error) {
				console.log(`Error getting connection ${error.stack}`);
				reject(error);
			}

			connection.query(
				"SELECT * FROM posts WHERE userID = ?",
				[userID],
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

module.exports.SubmitPost = ({ ownerId, title, body }) => {
	return new Promise((resolve, reject) => {
		db.getConnection((error, connection) => {
			if (error) {
				console.log(`Error getting connection ${error.stack}`);
				reject(error);
			}

			connection.query(
				"INSERT INTO posts SET ? ",
				[{ owner_id: ownerId, title, body }],
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
