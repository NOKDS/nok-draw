const router = require("express").Router();
const { User } = require("../db/models");
const { isAuthenticated } = require("../middleware/authMiddleware");

// Root here is localhost:8080/api/users/
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const allUsers = await User.findAll();
    allUsers
      ? res.status(200).json(allUsers)
      : res.status(404).send("Users Listing Not Found");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
