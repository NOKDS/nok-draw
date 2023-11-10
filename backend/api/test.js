const express = require("express");
const router = express.Router();
const {
  isAuthenticated,
  isAuthorized,
} = require("../middleware/authMiddleware");

router.get("/", isAuthenticated, (req, res) => {
  res.json({ message: "You are authenticated and authorized!" });
});

router.get("/admin", isAuthorized, (req, res) => {
  res.json({ message: "You are authorized as an admin!" });
});

module.exports = router;
