const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");

require("dotenv").config();

app.use(express.static(require("path").join(__dirname, "public")));

app.engine("ejs", require("ejs-mate"));
app.set("view engine", "ejs");
app.set("views", require("path").join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
	cors({
		origin: true,
		credentials: true,
	})
);

app.use(async (req, res, next) => {
	if (req.cookies["access-token"]) {
		let payload = jwt.decode(req.cookies["access-token"], process.env.JWT_SECRET);

		if (require("moment")().unix() < payload.expiresAt) {
			req.user = payload;
		}
	}
	
	res.locals.user = req.user;
	res.locals.message = "";
	next();
});

app.listen(process.env.PORT, process.env.HOSTNAME, () => {
	console.log(`Listening on Port : ${process.env.PORT}`);
});

app.use("/", require("./routes/index"));
app.use("/", require("./routes/user"));
app.use("/", require("./routes/admin"));
app.use("/p", require("./routes/post"));
