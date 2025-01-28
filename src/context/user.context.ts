import {
  UserReducerActionType,
  UserReducerStateType,
} from "@/reducers/user.reducer";
import { createContext, Dispatch } from "react";

type UserContextType = UserReducerStateType & {
  dispatch?: Dispatch<UserReducerActionType>;
};

const UserContext = createContext<UserContextType>({});

export default UserContext;
