import { AxiosError, AxiosRequestConfig } from "axios";

import { Reducer, useEffect, useReducer } from "react";
import client from "./supporting-document/client";
import ApiReducer from "./supporting-document/api.reducer";
import {
  RESET,
  SET_DATA_LOADED,
  SET_ERROR,
  SET_LOADING,
} from "./supporting-document/api.action-types";
import { LogoutRoute } from "./supporting-document/route-guard.config";
import useAuth from "./use-auth.hook";
import { useRouter } from "next/navigation";

interface ApiCallConfig {
  lazy?: boolean;
}

type RequestNonObjectValueType =
  | string
  | number
  | boolean
  | File
  | Array<string | number | File>
  | null;

type ValidationErrorMessageType = I18nMessage[];

type ValidationErrorType<R> = R extends RequestNonObjectValueType
  ? ValidationErrorMessageType
  : R extends Array<object>
  ? Array<ValidationErrorType<R[number]>>
  : {
      [k in keyof R]: ValidationErrorType<R[k]>;
    };

type ValidationErrorsType<R> = {
  [key in keyof R]: R[key] extends Required<R[key]>
    ? ValidationErrorType<R[key]>
    : ValidationErrorType<R[key]> | undefined;
};

function useApi<
  ResponseType,
  RequestType = {},
  ErrorType = {
    statusCode?: number;
    statusMessage?: string;
    code?: number;
    validationErrors?: ValidationErrorsType<RequestType>;
    status?: number;
    message?: string;
  }
>({
  lazy,
  method = "GET",
  data: requestData,
  headers: requestHeaders,
  ...rest
}: AxiosRequestConfig<RequestType> & ApiCallConfig) {
  const [state, dispatch] = useReducer<
    Reducer<
      {
        data: ResponseType | null;
        error: ErrorType | null;
        loading: boolean;
        loaded: boolean;
      },
      {
        action: string;
        payload?: Partial<{
          data: ResponseType | null;
          error: ErrorType | null;
          loading: boolean;
          loaded: boolean;
        }>;
      }
    >
  >(ApiReducer<ResponseType, ErrorType>, {
    loading: false,
    loaded: false,
    data: null,
    error: null,
  });
  const { token } = useAuth();
  const router = useRouter();

  const callApi = async (data?: RequestType) => {
    dispatch({ action: SET_LOADING, payload: { loading: true } });
    try {
      const res = await client.request({
        data,
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          ...requestHeaders,
        },
        method,
        ...rest,
      });
      dispatch({
        action: SET_DATA_LOADED,
        payload: { data: res.data as ResponseType },
      });
    } catch (err) {
      dispatch({
        action: SET_ERROR,
        payload: { error: (err as AxiosError).response?.data as ErrorType },
      });
    } finally {
      dispatch({ action: SET_LOADING, payload: { loading: false } });
    }
  };

  // call GET request immediately if not lazy
  useEffect(() => {
    if (!router.isReady) return;

    if (lazy || state.loading || state.loaded) {
      return;
    }
    if (method === "GET" && !state.loaded) {
      callApi(requestData);
    }
  }, [state.loading, state.loaded, router.isReady]);

  // call logout if api call failed
  useEffect(() => {
    if (!router.isReady) return;

    if (state.error && (state.error as any).statusCode === 401) {
      router.push(`${LogoutRoute}?next=${router.asPath}`);
    }
  }, [state.error, router.isReady]);

  // call logout if api call failed or accessToken is missing
  useEffect(() => {
    if (!router.isReady) return;

    if (state.error && (state.error as any).statusCode === 440) {
      console.log("cleaarning");
      // Clear localStorage auth_token
      localStorage.removeItem("auth_token");
      router.reload();
    }
  }, [state.error, router.isReady]);

  // Check if user.accessToken is missing (can be done after successful call if needed)
  useEffect(() => {
    if (
      state.data &&
      (state.data as any).user &&
      !(state.data as any).user.accessToken
    ) {
      // Clear localStorage auth_token
      localStorage.removeItem("auth_token");

      router.reload();
    }
  }, [state.data]);

  // let manual resetting the states
  const reset = () => {
    dispatch({
      action: RESET,
      payload: {
        data: null,
        error: null,
        loaded: false,
        loading: false,
      },
    });
  };

  return { ...state, callApi, reset };
}

export default useApi;
