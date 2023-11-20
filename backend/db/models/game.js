const { DataTypes } = require("sequelize");
const db = require("../db");

const Game = db.define("Game", {
  isWon: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  top3Predications: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Game;
