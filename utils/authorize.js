module.exports.Authorize = (roles = []) => {
	if (typeof roles === "string") roles = [roles];

	return (req, res, next) => {
		if (!req.user) {
			return res.status(401).redirect("/");
		}

		if (roles.length && !roles.includes(req.user.role))
			return res.status(401).redirect("/");

		next();
	};
};
