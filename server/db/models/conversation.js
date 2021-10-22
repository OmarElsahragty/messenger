const Sequelize = require("sequelize");
const db = require("../db");

const conversations = db.define("conversations", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = conversations;
