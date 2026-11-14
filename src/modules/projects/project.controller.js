const projectService = require("./project.service");

// GET all projects
const getAllProjects = (req, res, next) => {
    try {
        const projects = projectService.getAllProjects();

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error) {
        next(error);
    }
};

// GET project by ID
const getProjectById = (req, res, next) => {
    try {
        const project = projectService.getProjectById(
            req.params.id
        );

        if (!project) {
            const error = new Error("Project not found");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: project
        });
    } catch (error) {
        next(error);
    }
};

// CREATE project
const createProject = (req, res, next) => {
    try {
        const { name, description } = req.body;

        if (!name || typeof name !== "string" || !name.trim()) {
            const error = new Error("Project name is required");
            error.statusCode = 400;
            throw error;
        }

        const project = projectService.createProject({
            name: name.trim(),
            description: description || ""
        });

        res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: project
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllProjects,
    getProjectById,
    createProject
};