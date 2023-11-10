const router = require("express").Router();
const { Game } = require("../db/models");

// Root here is localhost:8080/api/users/
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
