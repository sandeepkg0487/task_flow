// scripts/setupDatabase.js

require("dotenv").config();

const { Client } = require("pg");
const { runner } = require("node-pg-migrate");
const path = require("path");

const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} = process.env;

const setupDatabase = async () => {
  let client;

  try {
    // Validate configuration
    if (!DB_HOST || !DB_PORT || !DB_USER || !DB_NAME) {
      throw new Error("Missing database configuration in .env");
    }

    // Prevent unsafe database identifiers
    if (!/^[a-zA-Z0-9_]+$/.test(DB_NAME)) {
      throw new Error("Invalid database name");
    }

    console.log("Checking PostgreSQL database...");

    // Connect to the default maintenance database
    client = new Client({
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
      database: "postgres",
    });

    await client.connect();

    // Check whether the application database exists
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [DB_NAME]
    );

    if (result.rowCount === 0) {
      console.log(`Creating database: ${DB_NAME}`);

      await client.query(`CREATE DATABASE "${DB_NAME}"`);

      console.log("Database created successfully!");
    } else {
      console.log("Database already exists.");
    }

    await client.end();
    client = null;

    // Build a connection URL safely, including special characters
    const databaseUrl = new URL("postgresql://localhost");

    databaseUrl.hostname = DB_HOST;
    databaseUrl.port = String(DB_PORT);
    databaseUrl.username = DB_USER;
    databaseUrl.password = DB_PASSWORD || "";
    databaseUrl.pathname = `/${DB_NAME}`;

    // Run pending migrations
    console.log("Running database migrations...");

   


    await runner({
  databaseUrl: process.env.DATABASE_URL,
  dir: path.resolve(__dirname, "../migrations"),
  direction: "up",
  migrationsTable: "pgmigrations",
  verbose: true,
  singleTransaction: true,
});

    console.log("--------------------------------");
    console.log("Database setup completed!");
    console.log("Database:", DB_NAME);
    console.log("--------------------------------");

  } catch (error) {
    console.error("Database setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    if (client) {
      await client.end().catch(() => {});
    }
  }
};

setupDatabase();