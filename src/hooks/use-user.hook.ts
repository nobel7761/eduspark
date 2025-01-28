import UserContext from "@/context/user.context";
import { IUser } from "@/types/user";
import { useContext } from "react";
import {
  DESTROY_SESSION,
  SET_USER,
} from "./supporting-document/user.action-types";

export default function useUser() {
  const { dispatch, ...rest } = useContext(UserContext);

  const setUser = (user?: IUser) => {
    if (dispatch) {
      dispatch({ action: SET_USER, payload: { user: user } });
    }
  };

  const destroySession = () => {
    if (dispatch) {
      dispatch({ action: DESTROY_SESSION });
    }
  };

  return {
    ...rest,
    setUser,
    destroySession,
  };
}
