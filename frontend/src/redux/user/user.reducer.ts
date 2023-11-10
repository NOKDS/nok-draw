import UserActionTypes from "./user.types";

interface UserState {
  singleUser: any;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  singleUser: {},
  isLoggedIn: false,
};

interface UserAction {
  type: string;
  payload: any;
}

const userReducer = (state: UserState = initialState, action: UserAction) => {
  switch (action.type) {
    case UserActionTypes.FETCH_USER:
      return { ...state, singleUser: action.payload };
    case UserActionTypes.UPDATE_USER:
    case UserActionTypes.SIGNUP_USER:
    case UserActionTypes.LOGIN_USER:
    case UserActionTypes.LOGIN_GOOGLE:
      return { ...state, singleUser: action.payload };
    case UserActionTypes.LOGOUT_USER:
      return { ...state, singleUser: {} };
    case UserActionTypes.DELETE_USER:
      return { ...state, singleUser: {} };
    // case UserActionTypes.SET_LOGIN_STATUS:
    //   return {
    //     ...state,
    //     isLoggedIn: action.payload,
    //   };
    default:
      return state;
  }
};

export default userReducer;
