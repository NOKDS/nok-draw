require("dotenv").config();
const express = require("express");
const db = require("./db");
const cors = require("cors");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const passport = require("passport");
const setupSocketServer = require("./wsocket");
const http = require("http");
const { User } = require("./db/models");
const app = express();

const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const sessionStore = new SequelizeStore({ db });

const PORT = process.env.PORT || 8080;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// app.use((req, res, next) => {
//   console.log(`Received request: ${req.method} ${req.url}`);
//   next();
// });

// app.use("/api", (req, res, next) => {
//   console.log(`API request: ${req.method} ${req.url}`);
//   next();
// });

app.get("/", (req, res) => {
  res.status(200).send(`Express on Vercel 🥳🤩 !!! with port ${PORT}`);
});

const serializeUser = (user, done) => done(null, user.id);
const deserializeUser = async (id, done) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    console.error("Deserialize User Error:", error);
    done(error);
  }
};

const sessionSecret = process.env.SESSION_SECRET;
const configSession = () => ({
  secret: sessionSecret,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  proxy: true,
  // cookie: {
  //   maxAge: 8 * 60 * 60 * 1000,
  //   httpOnly: true,
  //   path: "/",
  // },
  cookie: {
    maxAge: 8 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  },
});

const setupMiddleware = (app) => {
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
      credentials: true,
      allowedHeaders:
        "Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
      preflightContinue: true,
      optionsSuccessStatus: 204,
    })
  );

  app.enable("trust proxy");
  app.use(session(configSession()));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use((req, res, next) => {
    next();
  });

  return app;
};

const setupPassport = () => {
  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);
};

const setupRoutes = (app) => {
  app.use("/api", require("./api"));
  app.use("/auth", require("./auth"));
};

const startServer = async (app, port) => {
  await sessionStore.sync();
  await db.sync({ force: false });

  setupSocketServer(io);

  server.listen(port, () => console.log(`Server is on port:${port}`));
  return app;
};

const configureApp = async (port) => {
  setupPassport();
  setupMiddleware(app);
  setupRoutes(app);
  return startServer(app, port);
};

configureApp(PORT);

module.exports = app;
