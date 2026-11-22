
-- ======================================
-- TASKFLOW RBAC DATABASE MIGRATION
-- ======================================

-- 1. ROLES TABLE

CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 2. USER GROUPS TABLE

CREATE TABLE IF NOT EXISTS user_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 3. PERMISSIONS TABLE
-- Permissions are grouped by module.

CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    module_name VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(module_name, action)
);


-- 4. ROLE PERMISSIONS TABLE

CREATE TABLE IF NOT EXISTS role_permissions (
    id SERIAL PRIMARY KEY,

    role_id INTEGER NOT NULL,
    permission_id INTEGER NOT NULL,

    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (role_id)
        REFERENCES roles(id) ON DELETE CASCADE,

    FOREIGN KEY (permission_id)
        REFERENCES permissions(id) ON DELETE CASCADE,

    UNIQUE(role_id, permission_id)
);


-- 5. ADD ROLE AND GROUP TO EXISTING USERS TABLE

ALTER TABLE users
ADD COLUMN IF NOT EXISTS role_id INTEGER
REFERENCES roles(id) ON DELETE SET NULL;

ALTER TABLE users
ADD COLUMN IF NOT EXISTS group_id INTEGER
REFERENCES user_groups(id) ON DELETE SET NULL;


-- ======================================
-- INDEXES
-- ======================================

CREATE INDEX IF NOT EXISTS idx_permissions_module
ON permissions(module_name);

CREATE INDEX IF NOT EXISTS idx_role_permissions_role
ON role_permissions(role_id);

CREATE INDEX IF NOT EXISTS idx_role_permissions_permission
ON role_permissions(permission_id);

CREATE INDEX IF NOT EXISTS idx_users_role
ON users(role_id);

CREATE INDEX IF NOT EXISTS idx_users_group
ON users(group_id);
