const router = require("express").Router();
router.use("/me", require("./me"));
router.use("/login", require("./login"));
router.use("/logout", require("./logout"));
router.use("/signup", require("./signup"));
router.use("/google", require("./google"));

module.exports = router;
