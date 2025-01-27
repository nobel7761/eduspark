import {
  AuthReducerActionType,
  AuthReducerStateType,
} from "@/reducers/auth.reducer";
import { createContext, Dispatch } from "react";

type AuthContextType = AuthReducerStateType & {
  dispatch?: Dispatch<AuthReducerActionType>;
};

const initialState: AuthContextType = {
  token: "",
  loaded: false,
};

const AuthContext = createContext<AuthContextType>(initialState);

export default AuthContext;
