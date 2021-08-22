const { Op } = require("sequelize");
const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id"],
      order: [[Message, "createdAt", "ASC"]],
      include: [
        { model: Message, order: ["createdAt", "ASC"] },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    const getLastMsgDate = (convo) => {
      const temp = convo.dataValues.messages;
      return new Date(temp[temp.length - 1].createdAt);
    };
    // * sorting conversations descending by last message createdAt
    conversations.sort((convoA, convoB) => {
      return getLastMsgDate(convoB) - getLastMsgDate(convoA);
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      // set properties for notification count and latest message preview
      convoJSON.latestMessageText =
        convoJSON.messages[convoJSON.messages.length - 1].text;
      conversations[i] = convoJSON;

      conversations[i].unseenMessagesCount = 0;
      convoJSON.messages.map((message) => {
        if (message.senderId !== userId && !message.isSeen) {
          conversations[i].unseenMessagesCount++;
        }
      });
    }

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

router.patch("/markAsSeen/:id", async (req, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    if (!req.params.id) return res.sendStatus(400);

    const userId = req.user.id;
    const conversationId = req.params.id;

    const updatedConversation = await Message.update(
      { isSeen: true },
      {
        where: {
          conversationId,
          senderId: {
            [Op.not]: userId,
          },
        },
        returning: true,
      }
    );

    res.json(updatedConversation[1]);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
