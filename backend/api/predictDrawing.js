const router = require("express").Router();
const axios = require("axios");
const { Game } = require("../db/models");

router.post("/", async (req, res) => {
  try {
    const { canvas_data, room_name, user_id, category } = req.body;
    const flaskResponse = await axios.post("https://flask-server-jtnk.onrender.com/predict", {
      canvas_data,
      room_name,
      user_id,
    });
    const guesses = flaskResponse.data.message.guesses;
    const status = category === guesses[0];
    const response = {
      isWon: status,
      top4Predications: flaskResponse.data.message.guesses,
    };

    if (req.user) {
      const top4PredictionsString = JSON.stringify(
        flaskResponse.data.message.guesses
      );

      await Game.create({
        isWon: status,
        category: category,
        top4Predications: top4PredictionsString,
        UserId: req.user.id,
      });
      console.log(guesses);
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
