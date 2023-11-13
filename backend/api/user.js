const router = require("express").Router();
const { User, Game } = require("../db/models");
const { isAuthenticated } = require("../middleware/authMiddleware");

router.get("/", isAuthenticated, (req, res, next) => {
  const { name, username, email, createdAt, updatedAt, image } = req.user;
  const user = {
    name,
    username,
    email,
    createdAt,
    updatedAt,
    image,
  };
  res.status(200).json(user);
});

router.put("/", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(403).json({ error: "Access denied" });
    }
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(400).json({ error: "Failed to update settings" });
    }
    await user.update(req.body);
    console.log(`${user.username} updated settings successfully`);
    const userData = {
      name: user.name,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      image: user.image,
    };
    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
});

router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const gameData = req.body;
    gameData.UserId = req.user.id;
    const game = await Game.create(gameData);

    if (game) {
      console.log("Game added successfully");
      res.status(200).json({ message: "Game added successfully" });
    } else {
      console.log("Failed to create game");
      res.status(400).json({ error: "Failed to create game" });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/games", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const games = await Game.findAll({
      where: { UserId: userId },
    });

    res.status(200).json(games);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
