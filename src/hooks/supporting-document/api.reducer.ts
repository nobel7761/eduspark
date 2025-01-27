import {
  RESET,
  SET_DATA_LOADED,
  SET_ERROR,
  SET_LOADING,
} from "./api.action-types";

function ApiReducer<ResponseType, ErrorType>(
  state: {
    data: ResponseType | null;
    error: ErrorType | null;
    loading: boolean;
    loaded: boolean;
  },
  action: {
    action: string;
    payload?: Partial<{
      data: ResponseType | null;
      error: ErrorType | null;
      loading: boolean;
      loaded: boolean;
    }>;
  }
): {
  data: ResponseType | null;
  error: ErrorType | null;
  loading: boolean;
  loaded: boolean;
} {
  switch (action.action) {
    case SET_LOADING: {
      return { ...state, loading: action.payload?.loading || false };
    }
    case SET_DATA_LOADED: {
      return {
        ...state,
        data: action.payload?.data || null,
        error: null,
        loaded: true,
      };
    }
    case SET_ERROR: {
      return {
        ...state,
        data: null,
        error: action.payload?.error || null,
        loaded: true,
      };
    }
    case RESET: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
}

export default ApiReducer;
