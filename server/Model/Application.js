const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  company: String,
  category: String,
  coverLetter: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  application: Object,
  user: Object,
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});

module.exports = mongoose.model("Application", applicationSchema);