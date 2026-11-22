
const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

const runMigrations = async () => {
  const client = await pool.connect();

  try {
    // Track already executed migrations
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const migrationsPath = path.join(__dirname, "migrations");

    const files = fs
      .readdirSync(migrationsPath)
      .filter(file => file.endsWith(".sql"))
      .sort();

    for (const file of files) {
      const existing = await client.query(
        "SELECT id FROM schema_migrations WHERE filename = $1",
        [file]
      );

      if (existing.rows.length > 0) {
        console.log(`Already executed: ${file}`);
        continue;
      }

      const sql = fs.readFileSync(
        path.join(migrationsPath, file),
        "utf8"
      );

      await client.query("BEGIN");

      try {
        await client.query(sql);

        await client.query(
          `INSERT INTO schema_migrations (filename)
           VALUES ($1)`,
          [file]
        );

        await client.query("COMMIT");

        console.log(`Migration completed: ${file}`);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }

    console.log("All migrations completed successfully");

  } catch (error) {
    console.error("Migration failed:", error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
};

runMigrations();
