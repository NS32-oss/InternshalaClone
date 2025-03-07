const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { connect } = require("./db");
const router = require("./Routes/index");
const port = process.env.PORT || 8080;

const app = express();

// For debugging: log the incoming Origin header
app.use((req, res, next) => {
  console.log("Incoming Origin:", req.headers.origin);
  next();
});

// Temporarily allow all origins (for debugging only)
app.use(
  cors({
    origin: function (origin, callback) {
      // Log the origin being checked
      console.log("Checking Origin:", origin);
      // Allow all origins for now
      callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json());

// Set COOP and COEP headers (if needed)
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
