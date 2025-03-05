const express = require("express");
const router = express.Router();
const Job = require("../Model/Jobs");

router.post("/", async (req, res) => {
  const jobData = new Job({
    title: req.body.title,
    company: req.body.company,
    location: req.body.location,
    Experience: req.body.Experience,
    category: req.body.category,
    aboutCompany: req.body.aboutCompany,
    aboutJob: req.body.aboutJob,
    Whocanapply: req.body.Whocanapply,
    perks: req.body.perks,
    AdditionalInfo: req.body.AdditionalInfo,
    CTC: req.body.CTC,
    StartDate: req.body.StartDate,
  });
  await jobData
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.log(error, "Not able to post the data");
      res.status(500).send("Internal server error");
    });
});

router.get("/", async (req, res) => {
  try {
    const data = await Job.find();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Job.findById(id);
    if (!data) {
      res.status(404).json({ error: "Job not found" });
      return;
    }
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;