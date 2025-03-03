const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

const otpStore = {};
const requestInterval = 60 * 1000; // 60 seconds

const sendOtp = async (req, res) => {
  let { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: "Email is required" });
  }

  email = email.toLowerCase(); // Normalize email

//   console.log("Sending OTP to:", email);
//   console.log("Current OTP Store:", otpStore); // Debugging log

  const existingEntry = otpStore[email];
  const currentTime = Date.now();

  if (
    existingEntry &&
    currentTime - existingEntry.lastRequested < requestInterval
  ) {
    return res
      .status(429)
      .json({
        success: false,
        error: "Too many OTP requests. Please try again later.",
      });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "OTP for application submission",
    text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");

    otpStore[email] = {
      otp,
      expires: Date.now() + 10 * 60 * 1000,
      lastRequested: Date.now(),
    };

    console.log("Updated OTP Store:", otpStore); // Debugging log

    return res
      .status(200)
      .json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ success: false, error: "Error sending OTP" });
  }
};

const verifyOtp = async (req, res) => {
  let { email, otp } = req.body;

  if (!email || !otp) {
    return res
      .status(400)
      .json({ success: false, error: "Email and OTP are required" });
  }

  email = email.toLowerCase(); // Normalize email

//   console.log("Verifying OTP for:", email);
//   console.log("OTP Store at Verification:", otpStore);

  const entry = otpStore[email];

  if (!entry) {
    return res
      .status(400)
      .json({ success: false, error: "OTP not found or has expired" });
  }

  if (entry.otp === otp && entry.expires > Date.now()) {
    delete otpStore[email];
    return res
      .status(200)
      .json({ success: true, message: "OTP verified successfully." });
  }

  return res
    .status(400)
    .json({ success: false, error: "Invalid or expired OTP" });
};

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

module.exports = router;
