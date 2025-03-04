const express = require("express");
const router = express.Router();
const ApplicationRoute = require("./applicationRoute");
const internshipRoute = require("./trainingProgramsRoute"); // Renamed route
const jobRoute = require("./positionsRoute"); // Renamed route
const adminRoute = require("./admin");
const otpRoute = require("./otpRoute");
const paymentRoute = require("./paymentRoute");

router.get("/", (req, res) => {
  res.send("This is the backend");
});

router.use("/application", ApplicationRoute);
router.use("/training-programs", internshipRoute); // Updated route
router.use("/positions", jobRoute); // Updated route
router.use("/admin", adminRoute);
router.use("/otp", otpRoute);
router.use("/payment", paymentRoute);

module.exports = router;
