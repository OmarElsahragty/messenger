const Sequelize = require("sequelize");
const db = require("../db");

const Message = db.define(
  "message",
  {
    text: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    conversationId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "conversations",
        key: "id",
      },
    },
    senderId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    db,
    tableName: "messages",
  }
);

module.exports = Message;
