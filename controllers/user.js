const bcrypt = require("bcryptjs");
const User = require("../models/user");

require("dotenv").config();

exports.register_post = async (req, res) => {
	const { username, email, password } = req.body;
	
	if (await User.GetByEmail(email))
		return res.send({ message: "That email is alredy in use." });

	if (await !User.GetByAccount(username)){
		return res.send({ message: "That account name is alredy in use." });
	}

	await User.Register({ name: username, password, email });
};

exports.register_get = (req, res) => {
	if (!req.user) {
		return res.render("pages/user/register");
	}

	return res.redirect("/");
};

exports.login_post = async (req, res) => {
	await User.Login(res, req.body);
};

exports.login_get = (req, res) => {
	if (!req.user) {
		return res.render("pages/user/login");
	}

	return res.redirect("/");
};

exports.logout_get = async (req, res) => {
	res.clearCookie("access-token");

	return res.redirect("/");
};

exports.profile_get = async (req, res) => {
	if (!req.user) {
		return res.redirect("/");
	}

	let characters = await User.GetCharacters(req.user.id);
	
	return res.render("pages/user/profile", { characters });
}

