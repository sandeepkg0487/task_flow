const express = require("express");

const router = express.Router();

const projectController = require("./project.controller");

// GET all projects
router.get(
    "/",
    projectController.getAllProjects
);

// GET project by ID
router.get(
    "/:id",
    projectController.getProjectById
);

// CREATE project
router.post(
    "/",
    projectController.createProject
);

module.exports = router;