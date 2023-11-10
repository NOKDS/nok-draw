import axios from "axios";
import GameActionTypes from "./game.types";

export const addGame = (gameData) => ({
  type: GameActionTypes.ADD_GAME,
  payload: gameData,
});

export const addGameThunk = (gameData) => {
  return async (dispatch) => {
    try {
      console.log("ADDGAMETHUNK IS FIRING UP");
      console.log(gameData);
      const response = await axios.post(
        "http://localhost:8080/api/game",
        gameData,
        {
          withCredentials: true,
        }
      );
      dispatch(addGame(response.data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const fetchGames = (userId) => ({
  type: GameActionTypes.FETCH_GAMES,
  payload: userId,
});

export const fetchGamesThunk = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/games`, {
        withCredentials: true,
      });
      dispatch(fetchGames(response.data));
    } catch (error) {
      console.error(error);
    }
  };
};
