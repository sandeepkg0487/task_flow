
const modules = [
  {
    name: "Users",
    slug: "users",
    description: "User management",
    permissions: ["create", "read", "update", "delete"],
  },
  {
    name: "Tasks",
    slug: "tasks",
    description: "Task management",
    permissions: ["create", "read", "update", "delete"],
  },
  {
    name: "Projects",
    slug: "projects",
    description: "Project management",
    permissions: ["create", "read", "update", "delete"],
  },
  {
    name: "Roles",
    slug: "roles",
    description: "Role management",
    permissions: ["create", "read", "update", "delete"],
  },
  {
    name: "Reports",
    slug: "reports",
    description: "Report management",
    permissions: ["view", "export"],
  },
];

const seedPermissions = async (client) => {
  for (const module of modules) {
    // 1. Insert module
    const moduleResult = await client.query(
      `INSERT INTO modules (name, slug, description)
       VALUES ($1, $2, $3)
       ON CONFLICT (slug)
       DO UPDATE SET
         name = EXCLUDED.name,
         description = EXCLUDED.description
       RETURNING id`,
      [module.name, module.slug, module.description]
    );

    const moduleId = moduleResult.rows[0].id;

    // 2. Insert permissions
    for (const action of module.permissions) {
      const permissionName = `${module.slug}:${action}`;

      await client.query(
        `INSERT INTO permissions
         (module_id, name, action, description)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (module_id, action)
         DO UPDATE SET
           name = EXCLUDED.name,
           description = EXCLUDED.description`,
        [
          moduleId,
          permissionName,
          action,
          `${action} permission for ${module.name}`,
        ]
      );
    }
  }

  console.log("Default permissions seeded successfully");
};

module.exports = seedPermissions;
