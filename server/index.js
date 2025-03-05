const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { connect } = require("./db");
const router = require("./Routes/index");
const port = process.env.PORT || 5000;

const app = express();

const allowedOrigins = ["https://internship-hub-two.vercel.app"];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json());

// Set COOP and COEP headers
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

app.get("/", (req, res) => {
  res.send("Hello This is My backend");
});

app.use("/api", router);

connect();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});