import { LocalStorageAccessTokenKey } from "@/constants/auth.constants";
import {
  LOGOUT,
  SET_TOKEN_LOADED,
  UPDATE_TOKEN,
} from "@/hooks/supporting-document/api.action-types";
import { Reducer } from "react";

export type AuthReducerStateType = {
  token?: string;
  loaded?: boolean;
};

export type AuthReducerActionType = {
  action: string;
  payload?: AuthReducerStateType;
};

export function readAuthToken(): string {
  return window.localStorage.getItem(LocalStorageAccessTokenKey) || "";
}

export function saveAuthToken(token?: string) {
  window.localStorage.setItem(LocalStorageAccessTokenKey, token || "");
}

const AuthReducer: Reducer<AuthReducerStateType, AuthReducerActionType> = (
  state,
  action
) => {
  switch (action.action) {
    case UPDATE_TOKEN: {
      saveAuthToken(action.payload?.token);
      return { ...state, token: action.payload?.token };
    }
    case SET_TOKEN_LOADED: {
      saveAuthToken(action.payload?.token);
      return {
        ...state,
        token: action.payload?.token,
        loaded: action.payload?.loaded,
      };
    }

    case LOGOUT: {
      saveAuthToken("");
      return {
        ...state,
        token: "",
      };
    }

    default:
      return state;
  }
};

export default AuthReducer;
