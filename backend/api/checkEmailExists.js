const router = require("express").Router();
const { User } = require("../db/models");

router.post("/", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      console.log("Email already exists");
      res.status(200).json({ exists: true });
    } else {
      console.log("Email doesn't exists");

      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
