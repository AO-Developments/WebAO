const Post = require("../models/post");

exports.post_post = async (req, res) => {
	const { title, body } = req.body;
	await Post.SubmitPost({ owner_id: req.user.id, title, body });

	res.redirect("/");
};

exports.post_get = async (req, res) => {
	const post = await Post.GetById(req.params.id);
	res.render("pages/post/post", { post });
};
