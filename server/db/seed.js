const db = require("./db");
const { User, Conversation, Message, Participant } = require("./models");

async function seed() {
  await db.sync({ force: true });
  console.log("db synced!");

  await Promise.all([
    User.create({
      id: 1,
      username: "thomas",
      email: "thomas@email.com",
      password: "123456",
      photoUrl:
        "https://res.cloudinary.com/dmlvthmqr/image/upload/v1607914467/messenger/thomas_kwzerk.png",
    }),
    User.create({
      id: 2,
      username: "santiago",
      email: "santiago@email.com",
      password: "123456",
      photoUrl:
        "https://res.cloudinary.com/dmlvthmqr/image/upload/v1607914466/messenger/775db5e79c5294846949f1f55059b53317f51e30_s3back.png",
    }),
    User.create({
      id: 3,
      username: "chiumbo",
      email: "chiumbo@email.com",
      password: "123456",
      photoUrl:
        "https://res.cloudinary.com/dmlvthmqr/image/upload/v1607914468/messenger/8bc2e13b8ab74765fd57f0880f318eed1c3fb001_fownwt.png",
    }),
    User.create({
      id: 4,
      username: "hualing",
      email: "hualing@email.com",
      password: "123456",
      photoUrl:
        "https://res.cloudinary.com/dmlvthmqr/image/upload/v1607914466/messenger/6c4faa7d65bc24221c3d369a8889928158daede4_vk5tyg.png",
    }),
    User.create({
      id: 5,
      username: "ashanti",
      email: "ashanti@email.com",
      password: "123456",
      photoUrl:
        "https://res.cloudinary.com/dmlvthmqr/image/upload/v1607914466/messenger/68f55f7799df6c8078a874cfe0a61a5e6e9e1687_e3kxp2.png",
    }),
    User.create({
      id: 6,
      username: "julia",
      email: "julia@email.com",
      password: "123456",
      photoUrl:
        "https://res.cloudinary.com/dmlvthmqr/image/upload/v1607914468/messenger/d9fc84a0d1d545d77e78aaad39c20c11d3355074_ed5gvz.png",
    }),
    User.create({
      id: 7,
      username: "cheng",
      email: "cheng@email.com",
      password: "123456",
      photoUrl:
        "https://res.cloudinary.com/dmlvthmqr/image/upload/v1607914466/messenger/9e2972c07afac45a8b03f5be3d0a796abe2e566e_ttq23y.png",
    }),
  ]);

  await Conversation.create(
    {
      messages: [
        {
          senderId: 2,
          text: "Where are you from?",
        },
        {
          senderId: 1,
          text: "I'm from New York",
        },
        {
          senderId: 2,
          text: "Share photo of your city, please",
        },
      ],
      participants: [{ userId: 1 }, { userId: 2 }],
    },
    {
      include: [
        { model: Message, as: "messages" },
        { model: Participant, as: "participants" },
      ],
    }
  );

  await Conversation.create(
    {
      messages: [
        {
          senderId: 3,
          text: "TEST!",
        },
      ],
      participants: [{ userId: 2 }, { userId: 3 }],
    },
    {
      include: [
        { model: Message, as: "messages" },
        { model: Participant, as: "participants" },
      ],
    }
  );

  await Conversation.create(
    {
      messages: [
        {
          senderId: 4,
          text: "a testing message",
        },
        {
          senderId: 4,
          text: "Hualing says 🙋‍♂️",
        },
      ],
      participants: [{ userId: 1 }, { userId: 4 }],
    },
    {
      include: [
        { model: Message, as: "messages" },
        { model: Participant, as: "participants" },
      ],
    }
  );

  await Conversation.create(
    {
      messages: [
        {
          senderId: 1,
          text: "Thomas says 🙋‍♂️",
        },
        {
          senderId: 2,
          text: "Santiago says 🙋‍♂️",
        },
        {
          senderId: 3,
          text: "Chiumbo says 🙋‍♂️",
        },
        {
          senderId: 4,
          text: "Hualing says 🙋‍♂️",
        },
      ],
      participants: [
        { userId: 1 },
        { userId: 2 },
        { userId: 3 },
        { userId: 4 },
      ],
    },
    {
      include: [
        { model: Message, as: "messages" },
        { model: Participant, as: "participants" },
      ],
    }
  );

  console.log(`seeded users and messages`);
}

async function runSeed() {
  console.log("seeding...");
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log("closing db connection");
    await db.close();
    console.log("db connection closed");
  }
}

if (module === require.main) {
  runSeed();
}
