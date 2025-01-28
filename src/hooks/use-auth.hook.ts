import { useContext } from "react";
import { LOGOUT, UPDATE_TOKEN } from "./supporting-document/api.action-types";
import AuthContext from "@/context/auth.context";
import { UserType } from "@/enums/user-type.enum";
import { useRouter } from "next/navigation";
import { LocalStorageAccessTokenKey } from "@/constants/auth.constants";

export default function useAuth() {
  const { dispatch, ...rest } = useContext(AuthContext);
  const router = useRouter();

  const login = async (token: string, userType: UserType) => {
    if (dispatch) {
      dispatch({ action: UPDATE_TOKEN, payload: { token } });

      // Set both localStorage and cookies
      localStorage.setItem(LocalStorageAccessTokenKey, token);
      document.cookie = `auth_token=${token}; path=/`;
      document.cookie = `user_type=${userType}; path=/`;

      // Add a slight delay before redirect to allow loading state to show
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Only redirect to dashboard if user is Admin or SuperAdmin
      if (userType === UserType.Admin || userType === UserType.SuperAdmin) {
        router.push("/");
      } else {
        // Redirect non-admin users to appropriate page
        router.push("/login");
      }
    }
  };

  const logout = () => {
    if (dispatch) {
      dispatch({ action: LOGOUT });

      // Clear both localStorage and cookies
      localStorage.removeItem(LocalStorageAccessTokenKey);
      document.cookie =
        "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie =
        "user_type=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      router.push("/login");
    }
  };

  // Add a new method to check token consistency
  const checkTokenConsistency = () => {
    const localToken = localStorage.getItem(LocalStorageAccessTokenKey);
    const cookieToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_token="))
      ?.split("=")[1];

    // If there's a mismatch between localStorage and cookies, logout
    if ((!localToken && cookieToken) || (localToken && !cookieToken)) {
      logout();
    }
  };

  return {
    ...rest,
    login,
    logout,
    checkTokenConsistency,
  };
}
