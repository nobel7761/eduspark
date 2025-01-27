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
    const token = readAuthToken();

    dispatch({
      action: SET_TOKEN_LOADED,
      payload: { token, loaded: true },
    });
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
