const router = require("express").Router();
const { isAuthenticated } = require("../middleware/authMiddleware");

router.get("/", (req, res, next) => {
  console.log(req.user);
  const { name, username, email, googleId, createdAt, updatedAt } = req.user;
  const user = {
    name,
    username,
    email,
    createdAt,
    updatedAt,
  };

  if (googleId) {
    user.googleId = googleId;
  }

  res.status(200).json(user);
});

module.exports = router;
