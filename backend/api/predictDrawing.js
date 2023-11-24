const router = require("express").Router();
const axios = require("axios");
const { Game } = require("../db/models");

router.post("/", async (req, res) => {
  try {
    const { canvas_data, room_name, user_id, category } = req.body;
    const flaskResponse = await axios.post("http://127.0.0.1:5000/predict", {
      canvas_data,
      room_name,
      user_id,
    });
    const guesses = flaskResponse.data.message.guesses;
    const status = category === guesses[0];
    const response = {
      isWon: status,
      top3Predications: flaskResponse.data.message.guesses,
      image: canvas_data,
    };

    if (req.user) {
      const top3PredictionsString = JSON.stringify(
        flaskResponse.data.message.guesses
      );

      await Game.create({
        isWon: status,
        category: category,
        top3Predications: top3PredictionsString,
        image: canvas_data,
        UserId: req.user.id,
      });
      try {
      } catch (error) {
        console.error("Error:", error.message);
      }
    }

    res.status(flaskResponse.status).json(response);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});

module.exports = router;
