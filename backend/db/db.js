const { Sequelize } = require("sequelize");
const { name } = require("../package.json");

// adding user 'postgres@' removed errors for me
// If it causes errors on your end remove it.
const db = new Sequelize(`postgres://postgres@localhost:5432/${name}`, {
  logging: false,
});

module.exports = db;
