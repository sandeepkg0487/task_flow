const permissions = [
  // TASKS MODULE
  {
    module_name: "Tasks",
    name: "Create Task",
    action: "create",
    description: "Create new tasks",
  },
  {
    module_name: "Tasks",
    name: "View Task",
    action: "view",
    description: "View tasks",
  },
  {
    module_name: "Tasks",
    name: "Update Task",
    action: "update",
    description: "Update tasks",
  },
  {
    module_name: "Tasks",
    name: "Delete Task",
    action: "delete",
    description: "Delete tasks",
  },

  // USERS MODULE
  {
    module_name: "Users",
    name: "Create User",
    action: "create",
    description: "Create new users",
  },
  {
    module_name: "Users",
    name: "View User",
    action: "view",
    description: "View users",
  },
  {
    module_name: "Users",
    name: "Update User",
    action: "update",
    description: "Update users",
  },
  {
    module_name: "Users",
    name: "Delete User",
    action: "delete",
    description: "Delete users",
  },
];

const seedPermissions = async (client) => {
  for (const permission of permissions) {
    await client.query(
      `INSERT INTO permissions
        (module_name, name, action, description)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (module_name, action)
       DO UPDATE SET
         name = EXCLUDED.name,
         description = EXCLUDED.description`,
      [
        permission.module_name,
        permission.name,
        permission.action,
        permission.description,
      ]
    );
  }

  console.log("Permissions seeded");
};

module.exports = seedPermissions;
