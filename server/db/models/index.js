const User = require("./user");
const Participant = require("./participant");
const Conversation = require("./conversation");
const Message = require("./message");

// associations

Participant.belongsTo(User, {
  as: "user",
  foreignKey: "userId",
});
User.hasMany(Participant, {
  as: "participants",
  foreignKey: "userId",
});

Participant.belongsTo(Conversation, {
  as: "conversation",
  foreignKey: "conversationId",
});
Conversation.hasMany(Participant, {
  as: "participants",
  foreignKey: "conversationId",
});

Message.belongsTo(Conversation, {
  as: "conversation",
  foreignKey: "conversationId",
});
Conversation.hasMany(Message, {
  as: "messages",
  foreignKey: "conversationId",
});

module.exports = {
  User,
  Participant,
  Conversation,
  Message,
};
