// * Sets up the environment variables from your .env file

require("dotenv").config();

module.exports = Object.freeze({
  Port: parseInt(process.env.PORT || 3001),

  SessionSecret: process.env.SESSION_SECRET,

  DatabaseURL:
    process.env.DATABASE_URL || "postgres://localhost:5432/messenger",
});
