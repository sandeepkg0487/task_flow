const express = require("express");
const router = express.Router();
const authRoutes = require("../auth/authRoutes");

router.use("/auth", authRoutes);

router.get("/info1", (req, res) => {
    res.json({
        project_name: "My Project",
        version: "1.0.0",
        description: "Project information",
        status: "active"
    });
});

module.exports = router;