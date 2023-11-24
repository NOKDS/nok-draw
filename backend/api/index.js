const router = require("express").Router();

router.use("/user", require("./user"));
router.use("/games", require("./games"));
router.use("/me", require("./user"));
router.use("/test", require("./test"));
router.use("/predict", require("./predictDrawing"));

router.use((req, res, next) => {
  const error = new Error("404 Not Found");
  error.status = 404;
  next(error);
});

module.exports = router;
