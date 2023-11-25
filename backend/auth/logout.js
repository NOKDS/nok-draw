const { isAuthenticated } = require("../middleware/authMiddleware");

const router = require("express").Router();

router.get("/", isAuthenticated, (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    console.log(req);
    req.session.destroy((error) => {
      if (error) {
        console.error("Error occurred during logout:", error);
        return res
          .status(500)
          .json({ error: "An error occurred during logout" });
      }

      // console.log(`${user} logged out successfully`);
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

module.exports = router;
