import { AuthTypes } from "../types/auth";

interface AuthState {
  loading: boolean;
  error?: any;
  me?: any;
}

const auth = (state: AuthState = { loading: false }, action: any) => {
  switch (action.type) {
    case AuthTypes.ME_STARTED:
      return {
        ...state,
        loading: true,
      };
    case AuthTypes.ME_SUCCESS:
      return {
        ...state,
        loading: false,
        error: undefined,
        me: action.payload.me,
      };
    case AuthTypes.ME_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
};

export default auth;
