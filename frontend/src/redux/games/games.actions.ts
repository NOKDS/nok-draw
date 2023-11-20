import axios from "axios";
import GameActionTypes from "./games.types";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../rootReducer";
import { AnyAction } from "redux";

export const addGame = (gameData: any) => ({
  type: GameActionTypes.ADD_GAME,
  payload: gameData,
});

export const fetchGames = (gameData: any) => ({
  type: GameActionTypes.FETCH_GAMES,
  payload: gameData,
});

export const addGameThunk =
  (gameData: any): ThunkAction<void, RootState, null, AnyAction> =>
  async (dispatch) => {
    try {
      console.log("ADDGAMETHUNK IS FIRING UP");
      console.log(gameData);
      const response = await axios.post(
        "http://localhost:8080/api/games",
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

export const fetchGamesThunk =
  (userId: number): ThunkAction<void, RootState, null, AnyAction> =>
  async (dispatch) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/games`, {
        withCredentials: true,
      });
      dispatch(fetchGames(response.data));
    } catch (error) {
      console.error(error);
    }
  };
