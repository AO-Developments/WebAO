module.exports.cookieConfig = {
	expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 60 * 1000),
	httpOnly: true,
};
