const { Op } = require("sequelize");
const router = require("express").Router();
const { Conversation, Message, Participant, User } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    const userId = req.user.id;

    const { conversationId, recipientId, text } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      return res.json(
        await Message.create({
          text,
          conversationId,
          senderId: userId,
        })
      );
    }

    // create direct conversation
    const createdConversation = await Conversation.create(
      {
        messages: [{ text, senderId: userId }],
        participants: [{ userId }, { userId: recipientId }],
      },
      {
        include: [
          { model: Message, as: "messages" },
          { model: Participant, as: "participants" },
        ],
      }
    );

    const conversation = await Conversation.findByPk(createdConversation.id, {
      attributes: ["id", "createdAt"],
      include: [
        {
          model: Message,
          as: "messages",
          attributes: ["senderId", "text", "createdAt"],
        },
        {
          model: User,
          as: "users",
          through: { attributes: [] },
          where: { id: { [Op.not]: userId } },
          attributes: ["id", "username", "photoUrl"],
        },
      ],
    });
    const conversationJSON = conversation.toJSON();
    conversationJSON.lastSeen = Date.now();
    conversationJSON.unseenMessagesCount = 0;
    conversationJSON.latestMessageText = text;
    conversationJSON.photoUrl = conversationJSON.users[0].photoUrl;

    conversationJSON.name = conversationJSON.users
      .map(({ username }) => username)
      .join(", ");

    conversationJSON.onlineCount = onlineUsers.includes(recipientId) ? 1 : 0;

    res.json(conversationJSON);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
