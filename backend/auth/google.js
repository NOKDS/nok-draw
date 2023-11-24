const router = require("express").Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { User } = require("../db/models");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const username = profile.emails[0].value.split("@")[0];

        const [user] = await User.findOrCreate({
          where: { googleId },
          defaults: { name, username, email, googleId },
        });

        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    successRedirect: `${process.env.FRONTEND_URL}/login?googleSignInSuccess=true`,
  })
  // async (req, res) => {
  //   console.log("Google authentication successful");
  //   const user = await User.findOne({
  //     where: { email: req.user.dataValues.email },
  //   });

  //   req.login(user, (err) => {
  //     if (err) {
  //       return next(err);
  //     }
  //     console.log(`Logged in as ${user.username}`);
  //     const userData = {
  //       name: user.name,
  //       username: user.username,
  //       email: user.email,
  //       createdAt: user.createdAt,
  //       updatedAt: user.updatedAt,
  //       image: user.image,
  //     };
  //     req.session.save(() => {
  //       return res.status(200).json(userData);
  //     });
  //   });
  // }
);

module.exports = router;
