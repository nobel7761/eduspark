import { FC, PropsWithChildren } from "react";
import AuthProvider from "./auth.provider";
import UserProvider from "./user.provider";

const GlobalProviders: FC<PropsWithChildren> = ({ children }) => {
  return (
    <AuthProvider>
      <UserProvider>{children}</UserProvider>
    </AuthProvider>
  );
};

export default GlobalProviders;
