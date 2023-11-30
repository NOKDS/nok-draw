const { Sequelize } = require("sequelize");
require("dotenv").config();
require("pg");
// const { name } = require("../package.json");

// adding user 'postgres@' removed errors for me
// If it causes errors on your end remove it.
// const db = new Sequelize(`postgres://postgres@localhost:5432/${name}`, {
//   logging: false,
// });

const db =
  process.env.NODE_ENV === "dev"
    ? new Sequelize(
        process.env.POSTGRES_DATABASE,
        process.env.POSTGRES_USER,
        process.env.POSTGRES_PASSWORD,
        {
          host: process.env.POSTGRES_HOST || "localhost",
          dialect: "postgres",
          dialectModule: require("pg"),
          dialectOptions: {
            ssl: {
              require: true,
              rejectUnauthorized: true,
            },
          },
          logging: false,
        }
      )
    : new Sequelize(process.env.POSTGRES_URL, {
        dialect: "postgres",
        dialectModule: require("pg"),
        // dialectOptions: {
        //   ssl: {
        //     require: true,
        //     rejectUnauthorized: true,
        //   },
        // },
        logging: false,
      });

module.exports = db;
