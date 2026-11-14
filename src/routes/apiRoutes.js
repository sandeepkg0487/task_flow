const express = require("express");
const router = express.Router();

router.get("/info", (req, res) => {
    res.json({
        project_name: "My Project",
        version: "1.0.0",
        description: "Project information",
        status: "active"
    });
});

router.get("/info/status", (req, res) => {
    res.json({
        project_name: "My Project",
        version: "1.0.0",
        description: "Project information",
        status: "active"
    });
});

module.exports = router;