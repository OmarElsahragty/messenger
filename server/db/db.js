const Sequelize = require("sequelize");
const config = require("../config");

const db = new Sequelize(config.DatabaseURL, {
  logging: false,
});

module.exports = db;
