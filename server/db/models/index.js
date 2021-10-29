const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const Participant = require("./participant");

// associations

Conversation.belongsToMany(User, {
  as: "users",
  through: Participant,
  foreignKey: "conversationId",
  otherKey: "userId",
});
User.belongsToMany(Conversation, {
  as: "conversations",
  through: Participant,
  foreignKey: "userId",
  otherKey: "conversationId",
});
Message.belongsTo(Conversation, {
  as: "conversation",
  foreignKey: "conversationId",
});
Conversation.hasMany(Message, {
  as: "messages",
  foreignKey: "conversationId",
});
Participant.belongsTo(Conversation, {
  as: "conversation",
  foreignKey: "conversationId",
});
Conversation.hasMany(Participant, {
  as: "participants",
  foreignKey: "conversationId",
});
Participant.belongsTo(User, { as: "user", foreignKey: "userId" });
User.hasMany(Participant, { as: "participants", foreignKey: "userId" });

module.exports = {
  User,
  Conversation,
  Message,
  Participant,
};
