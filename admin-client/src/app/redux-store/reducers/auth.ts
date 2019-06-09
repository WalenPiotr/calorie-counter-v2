import { AuthTypes, Me } from "../types/auth";
import { RestError } from "../types/error";

interface AuthState {
  loading: boolean;
  error?: RestError;
  me?: Me;
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
