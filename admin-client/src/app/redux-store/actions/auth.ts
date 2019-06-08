import { AuthTypes } from "../types/auth";
import { Dispatch } from "redux";
import axios from "axios";

export const me = () => {
  return (dispatch: Dispatch) => {
    dispatch(meStarted());
    axios
      .create({ timeout: 10000, withCredentials: true })
      .get(`http://localhost:8080/auth/me`)
      .then(res => {
        dispatch(meSuccess(res.data));
      })
      .catch(err => {
        dispatch(meFailure(err.message));
      });
  };
};

const meSuccess = (user: any) => ({
  type: AuthTypes.ME_SUCCESS,
  payload: {
    me: user,
  },
});

const meStarted = () => ({
  type: AuthTypes.ME_STARTED,
});

const meFailure = (error: any) => ({
  type: AuthTypes.ME_FAILURE,
  payload: {
    error,
  },
});
