const db = require("./db");
const { User, Game } = require("./db/models");
const faker = require("faker");
const fs = require("fs");

const generateFakeUser = async () => {
  const salt = await User.generateSalt();
  return {
    name: faker.name.findName(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    salt: salt,
  };
};

const generateFakeGame = async (user) => {
  const isWon = await faker.datatype.boolean();

  return {
    isWon,
    top3Predications: ["Dolphin", "Shark", "Bird"],
    image:
      "https://i.pinimg.com/originals/2d/98/56/2d9856de5a0d3819b0b84d7b3333d0a5.jpg",
    UserId: user.id,
  };
};

const seedData = async () => {
  try {
    await db.sync({ force: true });
    const userData = await Promise.all(
      Array.from({ length: 10 }, generateFakeUser)
    );
    const userDataJSON = JSON.stringify(userData, null, 2);
    fs.writeFileSync("fakeUserData.json", userDataJSON, "utf-8");

    const users = await User.bulkCreate(userData);

    const games = [];
    await Promise.all(
      users.map(async (user) => {
        const userGame = await generateFakeGame(user);
        games.push(userGame);
      })
    );

    await Game.bulkCreate(games);

    console.log("Fake users and games data seeded successfully");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    await db.close();
  }
};

seedData();
