import {
  DESTROY_SESSION,
  SET_USER,
} from "@/hooks/supporting-document/user.action-types";
import { IUser } from "@/types/user";
import { Reducer } from "react";

export interface UserReducerStateType {
  user?: IUser;
}

export interface UserReducerActionType {
  action: string;
  payload?: UserReducerStateType;
}

const UserReducer: Reducer<UserReducerStateType, UserReducerActionType> = (
  state,
  action
) => {
  switch (action.action) {
    case SET_USER: {
      return {
        ...state,
        user: action.payload?.user,
      };
    }
    case DESTROY_SESSION: {
      return {};
    }

    default:
      return state;
  }
};

export default UserReducer;
