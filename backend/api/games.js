const router = require("express").Router();
const { Game } = require("../db/models");

router.get("/", async (req, res, next) => {
  try {
    const allGames = await Game.findAll();
    allGames
      ? res.status(200).json(allGames)
      : res.status(404).send("Games Listing Not Found");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
