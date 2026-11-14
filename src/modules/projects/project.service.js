const projects = [
    {
        id: 1,
        name: "TaskFlow",
        description: "Project management platform",
        status: "active"
    },
    {
        id: 2,
        name: "Learning API",
        description: "Express learning project",
        status: "active"
    }
];

const getAllProjects = () => {
    return projects;
};

const getProjectById = (id) => {
    return projects.find(
        (project) => project.id === Number(id)
    );
};

const createProject = (projectData) => {
    const newProject = {
        id: projects.length + 1,
        ...projectData,
        status: "active"
    };

    projects.push(newProject);

    return newProject;
};

module.exports = {
    getAllProjects,
    getProjectById,
    createProject
};