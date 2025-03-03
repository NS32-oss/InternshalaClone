const express = require("express");
const router = express.Router();
const ApplicationRoute = require("./applicationRoute");
const internshipRoute = require("./internshipRoute");
const jobRoute = require("./jobRoute");
const adminRoute = require("./admin");
const otpRoute = require("./otpRoute");

router.get("/", (req, res) => {
  res.send("This is the backend");
});

router.use("/application", ApplicationRoute);
router.use("/internship", internshipRoute);
router.use("/job", jobRoute);
router.use("/admin", adminRoute);
router.use("/otp",otpRoute)

module.exports = router;