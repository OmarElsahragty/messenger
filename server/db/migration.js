const db = require("./db");
const Sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");

const getLastSeenDate = async (conversationId, userId) => {
  const messages = await db.query(
    `SELECT "senderId", "isSeen", "updatedAt" FROM "messages" WHERE "conversationId" = ${conversationId} ORDER BY id DESC;`,
    { type: QueryTypes.SELECT }
  );

  for (let i = 0; i < messages.length; i++) {
    if (
      messages.length - 1 === i ||
      messages[i].senderId === userId ||
      messages[i].isSeen
    ) {
      return messages[i].updatedAt;
    }
  }
};

const migration = async () => {
  await db
    .authenticate()
    .then(async () => {
      console.log("Migrating...");
      const queryInterface = db.getQueryInterface();

      await Promise.all([
        queryInterface.createTable("participants", {
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
        }),
        queryInterface.addColumn("conversations", "name", {
          type: Sequelize.STRING,
          allowNull: true,
        }),
      ]);

      const conversations = await db.query(
        'SELECT "id", "user1Id", "user2Id" FROM "conversations";',
        { type: QueryTypes.SELECT }
      );

      await Promise.all(
        conversations.map(async ({ id, user1Id, user2Id }) => {
          await queryInterface.bulkInsert("participants", [
            {
              userId: user1Id,
              conversationId: id,
              lastSeen: await getLastSeenDate(id, user1Id),
            },
            {
              userId: user2Id,
              conversationId: id,
              lastSeen: await getLastSeenDate(id, user2Id),
            },
          ]);
        })
      );

      await Promise.all([
        queryInterface.removeColumn("conversations", "userId"),
        queryInterface.removeColumn("conversations", "user1Id"),
        queryInterface.removeColumn("conversations", "user2Id"),
        queryInterface.removeColumn("messages", "isSeen"),
      ]);

      console.log("✔️ Done");
    })
    .catch((err) => {
      console.error(
        "❌ Error: ",
        err.errors
          ? err.errors.map((error) => error.message).join(" and ")
          : err.message
      );
    })
    .finally(() => db.close());
};

migration();
