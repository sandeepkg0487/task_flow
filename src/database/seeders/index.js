const pool = require("../../config/db");
const seedPermissions = require("./permission.seeder");

const runSeeders = async () => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await seedPermissions(client);

    await client.query("COMMIT");

    console.log("All seeders completed successfully");
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Seeder failed:", error.message);

    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
};

runSeeders();