const Sequelize = require("sequelize");
const db = require("../db");

const Message = db.define("message", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
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
  text: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Message;
