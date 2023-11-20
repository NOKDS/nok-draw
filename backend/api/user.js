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

module.exports = router;
