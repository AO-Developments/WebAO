const Post = require("../models/post");

exports.post_post = async (req, res) => {
	const { title, body } = req.body;
	await Post.SubmitPost({ accountID: req.user.id, title, body });

	res.redirect("/");
};
