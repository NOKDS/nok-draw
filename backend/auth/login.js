const router = require("express").Router();
const { User } = require("../db/models");

router.post("/", async (req, res, next) => {
  try {
    const identifier = req.body.email || req.body.username;
    const password = req.body.password;

    if (!identifier || !password) {
      console.log("Invalid login attempt");
      return res.status(401).json({ error: "Invalid login attempt" });
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    let user;
    if (isEmail) {
      user = await User.findOne({ where: { email: identifier } });
    } else {
      user = await User.findOne({ where: { username: identifier } });
    }

    if (!user || !(await user.correctPassword(password))) {
      console.log("Invalid login attempt");
      return res.status(401).json({ error: "Invalid login attempt" });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      console.log(`Logged in as ${user.username}`);
      const userData = {
        name: user.name,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        image: user.image,
      };
      req.session.save(() => {
        return res.status(200).json(userData);
      });
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
