const { DataTypes } = require("sequelize");
const db = require("../db");

const Game = db.define("Game", {
  isWon: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = Game;
