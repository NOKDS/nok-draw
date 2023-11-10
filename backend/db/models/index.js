const Game = require("./game");
const User = require("./user");

Game.belongsTo(User);

module.exports = {
  Game,
  User,
};
