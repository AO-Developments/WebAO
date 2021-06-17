const express = require("express");
const Roles = require("../utils/roles");

let router = express.Router();

let admin_controller = require("../controllers/admin");

router.route("/admin")
	.get(require("../utils/authorize").Authorize([Roles.Admin]),admin_controller.admin_get);

module.exports = router;
