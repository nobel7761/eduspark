import { useContext } from "react";
import { LOGOUT, UPDATE_TOKEN } from "./supporting-document/api.action-types";
import AuthContext from "@/context/auth.context";

export default function useAuth() {
  const { dispatch, ...rest } = useContext(AuthContext);

  const login = (token: string) => {
    if (dispatch) {
      dispatch({ action: UPDATE_TOKEN, payload: { token } });
    }
  };

  const logout = () => {
    if (dispatch) {
      dispatch({ action: LOGOUT });
    }
  };

  return {
    ...rest,
    login,
    logout,
  };
}
