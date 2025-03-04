const express = require("express");
const router = express.Router();
const Internship = require("../Model/Internship");

router.post("/", async (req, res) => {
    const internshipData = new Internship({
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        Duration: req.body.Duration,
        category: req.body.category,
        aboutCompany: req.body.aboutCompany,
        aboutInternship: req.body.aboutInternship,
        Whocanapply: req.body.Whocanapply,
        perks: req.body.perks,
        AdditionalInfo: req.body.AdditionalInfo,
        stipend: req.body.stipend,
        StartDate: req.body.StartDate,
    });
    await internshipData.save()
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
        const data = await Internship.find();
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const data = await Internship.findById(id);
        if (!data) {
            res.status(404).json({ error: "Internship not found" });
            return;
        }
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;