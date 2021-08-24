const Sequelize = require("sequelize");
const db = require("../db");

const Conversation = db.define(
  "conversation",
  {
    name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    db,
    tableName: "conversations",
  }
);

module.exports = Conversation;
