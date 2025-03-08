const express = require("express");
const router = express.Router();
const Application = require("../Model/Application");

router.post("/", async (req, res) => {
  const applicationData = new Application({
    coverLetter: req.body.coverLetter,
    user: req.body.user,
    company: req.body.company,
    category: req.body.category,
    body: req.body.body,
    applicationId: req.body.applicationId,
  });
  await applicationData
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.log(error, "not able to post the data");
      res.status(500).send("Internal server error");
    });
});

router.get("/", async (req, res) => {
  try {
    const data = await Application.find();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Application.findById(id);
    if (!data) {
      res.status(404).json({ error: "Application not found" });
      return;
    }
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  let status;

  if (action === "accepted") {
    status = "accepted";
  } else if (action === "rejected") {
    status = "rejected";
  } else {
    res.status(400).json({ error: "Invalid action" });
    return;
  }

  try {
    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );

    if (!updatedApplication) {
      res.status(404).json({ error: "Not able to update the application" });
      return;
    }

    res.status(200).json({ success: true, data: updatedApplication });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
