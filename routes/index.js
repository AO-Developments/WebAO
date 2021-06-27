const express = require("express");
const Post = require("../models/post");

let router = express.Router();

router.get("/", async (req, res) => {
	let posts = await Post.GetTheLastestOnes(); 
	res.render("pages/index", { posts });
});

module.exports = router;
