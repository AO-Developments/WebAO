const express = require("express");
const Post = require("../models/post");

let router = express.Router();

router.get("/", async (req, res) => {
	let posts = await Post.GetByPage(0);
	res.render("pages/index", { posts, page:1 });
});

router.get("/page/:page", async (req, res) => {
	let posts = await Post.GetByPage(req.params.page);
	res.render("pages/index", { posts, page:++req.params.page });
});

module.exports = router;
