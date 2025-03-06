require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");
const moment = require("moment");
const nodemailer = require("nodemailer");
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const plans = {
  Free: { price: 0, limit: 1, plan_id: "plan_Q2FA0cSjT3cAQX" },
  Bronze: { price: 100, limit: 3, plan_id: "plan_Q2JMywRyORKBCW" },
  Silver: { price: 300, limit: 5, plan_id: "plan_Q2JNPiYp8DtLPb" },
  Gold: { price: 1000, limit: Infinity, plan_id: "plan_Q2JNmCfPKJH8NQ" },
};

// ✅ Allow payments only from 10-11 AM IST
const isAllowedTime = () => {
  const currentISTTime = moment().utcOffset("+05:30");
  return currentISTTime.hour() === 18;
};

router.post("/subscribe", async (req, res) => {
  const { email, plan } = req.body;

  if (!isAllowedTime()) {
    return res
      .status(400)
      .json({ error: "Payment is allowed only between 10-11 AM IST" });
  }

  if (!plans[plan]) {
    return res.status(400).json({ error: "Invalid plan selected" });
  }

  try {
    const subscription = await razorpay.subscriptions.create({
      plan_id: plans[plan].plan_id,
      customer_notify: 1,
      total_count: 12,
    });

    res.json({ subscription_id: subscription.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Send Email After Successful Payment
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendInvoiceEmail = async (email, plan, price) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Subscription Confirmation",
    text: `Dear User,\n\nThank you for subscribing to the ${plan.toUpperCase()} plan.\nAmount: ₹${price}/month\n\nBest Regards,\nInternship Portal`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// ✅ Webhook for Payment Confirmation
router.post("/razorpay-webhook", express.json(), async (req, res) => {
  const event = req.body;
  if (
    event.payload.payment &&
    event.payload.payment.entity.status === "captured"
  ) {
    const email = event.payload.payment.entity.email;
    const plan = event.payload.payment.entity.notes.plan;
    await sendInvoiceEmail(email, plan, plans[plan].price);
  }
  res.sendStatus(200);
});

module.exports = router;
