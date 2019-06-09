import { AuthTypes, Me } from "../types/auth";
import { RestError } from "../types/error";
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
        if (err && err.response && err.response.message) {
          dispatch(meFailure({ message: err.response.message }));
          return;
        }
        dispatch(meFailure({ message: "Something went wrong" }));
      });
  };
};

const meSuccess = (user: Me) => ({
  type: AuthTypes.ME_SUCCESS,
  payload: {
    me: user,
  },
});

const meStarted = () => ({
  type: AuthTypes.ME_STARTED,
});

const meFailure = (error: RestError) => ({
  type: AuthTypes.ME_FAILURE,
  payload: {
    error,
  },
});
