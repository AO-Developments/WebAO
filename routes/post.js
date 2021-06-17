const express = require("express");

let router = express.Router();

let post_controller = require("../controllers/post");

router.route("/new")
	.post(require("../utils/authorize").Authorize(["Admin"]),post_controller.post_post);

router.route("/:id").get(post_controller.post_get);

module.exports = router;
