const router = require("express").Router();
const { User, Game } = require("../db/models");
const { isAuthenticated } = require("../middleware/authMiddleware");

router.get("/", isAuthenticated, (req, res, next) => {
  const { name, username, email, createdAt, updatedAt } = req.user;
  const user = {
    name,
    username,
    email,
    createdAt,
    updatedAt,
  };

  res.status(200).json(user);
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
