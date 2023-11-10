import GameActionTypes from "./game.types";

export const INITIAL_GAME_STATE = {
  game: {},
  games: [],
};

const gameReducer = (state = INITIAL_GAME_STATE, action) => {
  switch (action.type) {
    case GameActionTypes.FETCH_GAMES:
      return { ...state, games: action.payload };
    case GameActionTypes.ADD_GAME:
      return { ...state, game: action.payload };
    default:
      return state;
  }
};

export default gameReducer;
