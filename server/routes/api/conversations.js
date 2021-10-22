const { Op } = require("sequelize");
const router = require("express").Router();
const { User, Conversation, Message, Participant } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    const userId = req.user.id;

    const conversations = [];

    const participants = await Participant.findAll({
      where: { userId },
      attributes: ["conversationId", "lastSeen"],
    });

    await Promise.all(
      participants.map(async ({ conversationId, lastSeen }) => {
        const conversation = await Conversation.findByPk(conversationId, {
          attributes: ["createdAt"],
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
        conversationJSON.name = "";
        conversationJSON.onlineCount = 0;
        conversationJSON.unseenMessagesCount = 0;
        conversationJSON.latestMessageText = null;

        // set conversation photoUrl if direct
        conversationJSON.photoUrl =
          conversationJSON.users.length === 1
            ? conversationJSON.users[0].photoUrl
            : null;

        // set property for online status of the a user and conversation name
        const usernamesArray = [];
        conversationJSON.users.map((user) => {
          if (onlineUsers.includes(user.id)) conversationJSON.onlineCount++;

          usernamesArray.push(user.username);
        });

        conversationJSON.name = usernamesArray.join(", ");

        for (const user of conversationJSON.users) {
          if (onlineUsers.includes(user.id)) {
            conversationJSON.online = true;
            break;
          }
        }

        // set latest message preview
        if (conversationJSON.messages.length > 0) {
          conversationJSON.latestMessageText =
            conversationJSON.messages[
              conversationJSON.messages.length - 1
            ].text;
        }

        // set notification count
        for (const message of conversationJSON.messages) {
          if (new Date(message.createdAt) < new Date(lastSeen)) {
            break;
          }
          conversationJSON.unseenMessagesCount++;
        }

        conversations.push({
          id: conversationId,
          ...conversationJSON,
          lastSeen,
        });
      })
    );

    // sorting conversations descending by last message createdAt
    const lastMessageDate = ({ messages, createdAt }) => {
      if (messages.length > 0) {
        return new Date(messages[messages.length - 1].createdAt);
      }
      return new Date(createdAt);
    };

    conversations.sort((conversationA, conversationB) => {
      return lastMessageDate(conversationB) - lastMessageDate(conversationA);
    });

    return res.json(conversations);
  } catch (error) {
    next(error);
  }
});

// create multi participants conversation
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    const userId = req.user.id;

    const { participants } = req.body;

    const conversation = await Conversation.create(
      { participants: [...participants, { userId }] },
      { include: [{ model: Participant, as: "participants" }] }
    );

    return res.json(conversation);
  } catch (error) {
    next(error);
  }
});

// update participant lastSeen
router.patch("/markAsSeen/:id", async (req, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    if (!req.params.id) return res.sendStatus(400);

    const userId = req.user.id;
    const conversationId = req.params.id;

    const updatedParticipant = await Participant.update(
      { lastSeen: Date.now() },
      {
        where: { conversationId, userId },
        returning: true,
      }
    );

    return res.json(updatedParticipant[1][0]);
  } catch (error) {
    next(error);
  }
});

// delete conversation participant
router.delete("/:conversationId/user/:userId", async (req, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    const { conversationId, userId } = req.params;
    if (!conversationId || !userId) return res.sendStatus(400);

    const destroyedParticipant = await Participant.destroy({
      where: {
        conversationId,
        userId,
      },
      returning: true,
      force: false,
    });
    if (destroyedParticipant[0]) return res.json(destroyedParticipant[0]);
    return res.sendStatus(404);
  } catch (error) {
    next(error);
  }
});

// add conversation participant
router.post("/:conversationId/user/:userId", async (req, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    const { conversationId, userId } = req.params;
    if (!conversationId || !userId) return res.sendStatus(400);

    try {
      return res.json(
        await Participant.create({
          conversationId,
          userId,
        })
      );
    } catch {
      const restoredParticipant = await Participant.restore({
        where: {
          conversationId,
          userId,
          deletedAt: { [Op.ne]: null },
        },
        returning: true,
      });

      if (restoredParticipant[0]) {
        const user = await User.findByPk(userId, {
          attributes: ["id", "username", "photoUrl"],
        });
        return res.json({
          ...restoredParticipant[0].toJSON(),
          user: user.toJSON(),
        });
      }
      return res.sendStatus(400);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
