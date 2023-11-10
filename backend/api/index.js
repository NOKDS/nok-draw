const router = require("express").Router();

// Already mounted on /api/
router.use("/users", require("./users"));
router.use("/games", require("./games"));
router.use("/me", require("./user"));
router.use("/test", require("./test"));

// 404 Handling
router.use((req, res, next) => {
  const error = new Error("404 Not Found");
  error.status = 404;
  next(error);
});

module.exports = router;
