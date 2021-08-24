const Sequelize = require("sequelize");
const db = require("../db");

const Participant = db.define(
  "participant",
  {
    userId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    conversationId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: "conversations",
        key: "id",
      },
    },
    lastSeen: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    db,
    tableName: "participants",
  }
);

module.exports = Participant;
