const { Sequelize } = require("sequelize");
require("dotenv").config();
// const { name } = require("../package.json");

// adding user 'postgres@' removed errors for me
// If it causes errors on your end remove it.
// const db = new Sequelize(`postgres://postgres@localhost:5432/${name}`, {
//   logging: false,
// });

let db;

if (process.env.NODE_ENV === "dev") {
  db = new Sequelize(
    process.env.POSTGRES_DATABASE,
    process.env.POSTGRES_USER,
    process.env.POSTGRES_PASSWORD,
    {
      host: process.env.POSTGRES_HOST || "localhost",
      dialect: "postgres",
      dialectModule: require("pg"),
      logging: false,
    }
  );
} else {
  db = new Sequelize(process.env.POSTGRES_URL, {
    dialect: "postgres",
    dialectModule: require("pg"),
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  });
}

module.exports = db;
