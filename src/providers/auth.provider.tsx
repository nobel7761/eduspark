"use client";

import { LocalStorageAccessTokenKey } from "@/constants/auth.constants";
import AuthContext from "@/context/auth.context";
import { SET_TOKEN_LOADED } from "@/hooks/supporting-document/api.action-types";
import AuthReducer, { readAuthToken } from "@/reducers/auth.reducer";
import { FC, PropsWithChildren, useEffect, useReducer } from "react";

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, {
    token: "",
    loaded: false,
  });

  // load already stored auth token on first load
  useEffect(() => {
    const localToken = readAuthToken();
    const cookieToken =
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_token="))
        ?.split("=")[1] || "";

    // If there's a mismatch between localStorage and cookies, clear both
    if ((!localToken && cookieToken) || (localToken && !cookieToken)) {
      localStorage.removeItem(LocalStorageAccessTokenKey);
      document.cookie =
        "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie =
        "user_type=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      dispatch({
        action: SET_TOKEN_LOADED,
        payload: { token: "", loaded: true },
      });
    } else {
      dispatch({
        action: SET_TOKEN_LOADED,
        payload: { token: localToken, loaded: true },
      });
    }
  }, []);

  // subscribe to auth token change in local storage
  useEffect(() => {
    window.addEventListener("storage", (event) => {
      if (event.key === LocalStorageAccessTokenKey) {
        dispatch({
          action: SET_TOKEN_LOADED,
          payload: { token: event.newValue || "", loaded: true },
        });
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
