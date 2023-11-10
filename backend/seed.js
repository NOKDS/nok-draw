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

const generateFakeGame = (user) => {
  return {
    isWon: faker.datatype.boolean(),
    UserId: user.id,
  };
};

const seedData = async () => {
  try {
    await db.sync({ force: true });
    const userData = await Promise.all(
      Array.from({ length: 10 }, generateFakeUser)
    );
    console.log("Fake user data:", userData);
    const userDataJSON = JSON.stringify(userData, null, 2);
    fs.writeFileSync("fakeUserData.json", userDataJSON, "utf-8");

    const users = await User.bulkCreate(userData);

    const games = [];
    users.forEach((user) => {
      const userGames = Array.from({ length: 5 }, () => generateFakeGame(user));
      games.push(...userGames);
    });

    await Game.bulkCreate(games);

    console.log("Fake users and games data seeded successfully");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    await db.close();
  }
};

seedData();
