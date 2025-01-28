"use client";

import UserContext from "@/context/user.context";
import { LogoutRoute } from "@/hooks/supporting-document/route-guard.config";
import {
  DESTROY_SESSION,
  SET_USER,
} from "@/hooks/supporting-document/user.action-types";
import useApi from "@/hooks/use-api.hook";
import useAuth from "@/hooks/use-auth.hook";
import UserReducer from "@/reducers/user.reducer";
import { IUser } from "@/types/user";
import { usePathname } from "next/navigation";
import { FC, PropsWithChildren, useEffect, useReducer } from "react";

const UserProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(UserReducer, {});

  const { token, loaded: tokenLoaded } = useAuth();
  const pathname = usePathname();
  const {
    data: userData,
    callApi: callUserApi,
    loading: userLoading,
  } = useApi<IUser>({ url: "/user", lazy: true });

  useEffect(() => {
    if (!tokenLoaded) {
      // let initialization take place first
      return;
    }
    if (tokenLoaded && !token) {
      // remove previously stored data
      dispatch({ action: DESTROY_SESSION });
    }
    if (token && !state.user && !userLoading) {
      if (!pathname.startsWith(LogoutRoute)) {
        console.log("Calling ");
        callUserApi();
      }
    }
  }, [token, tokenLoaded, userLoading, pathname, state.user]);

  useEffect(() => {
    if (userData) {
      dispatch({
        action: SET_USER,
        payload: {
          user: userData,
        },
      });
    }
  }, [userData]);

  return (
    <UserContext.Provider value={{ ...state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
