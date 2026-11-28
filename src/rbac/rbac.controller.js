const pool = require("../config/db");

const createRole = async (req, res) => {
    const client = await pool.connect();

    try {
        const {
            name,
            slug,
            description,
            permissionIds = []
        } = req.body;

        // Validate required fields
        if (!name || !slug) {
            return res.status(400).json({
                success: false,
                message: "Name and slug are required"
            });
        }

        if (!Array.isArray(permissionIds)) {
            return res.status(400).json({
                success: false,
                message: "permissionIds must be an array"
            });
        }

        // Remove duplicate IDs
        const uniquePermissionIds = [...new Set(permissionIds)];

        await client.query("BEGIN");

        // Validate permissions exist
        const permissionResult = await client.query(
            `SELECT id FROM permissions
             WHERE id = ANY($1::uuid[])`,
            [uniquePermissionIds]
        );

        if (
            permissionResult.rows.length !==
            uniquePermissionIds.length
        ) {
            await client.query("ROLLBACK");

            return res.status(400).json({
                success: false,
                message: "One or more permissions are invalid"
            });
        }

        // Create role
        const roleResult = await client.query(
            `INSERT INTO roles (name, slug, description)
             VALUES ($1, $2, $3)
             RETURNING id, name, slug, description`,
            [name, slug, description || null]
        );

        const role = roleResult.rows[0];

        // Assign permissions to role
        if (uniquePermissionIds.length > 0) {
            await client.query(
                `INSERT INTO role_permissions
                 (role_id, permission_id)
                 SELECT $1, permission_id
                 FROM unnest($2::uuid[]) AS permission_id`,
                [role.id, uniquePermissionIds]
            );
        }

        await client.query("COMMIT");

        return res.status(201).json({
            success: true,
            message: "Role created successfully",
            data: {
                ...role,
                permissionIds: uniquePermissionIds
            }
        });

    } catch (error) {

        await client.query("ROLLBACK");

        console.error("Create Role Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to create role"
        });

    } finally {
        client.release();
    }
};

module.exports = {
    createRole
};