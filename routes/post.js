const express = require("express");

let router = express.Router();

let post_controller = require("../controllers/post");

router
	.route("/post")
	.post(
		require("../utils/authorize").Authorize(["Admin"]),
		post_controller.post_post
	);

module.exports = router;
