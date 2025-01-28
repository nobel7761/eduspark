import { FC, PropsWithChildren } from "react";
import AuthProvider from "./auth.provider";
import UserProvider from "./user.provider";
const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <AuthProvider>
      <UserProvider>{children}</UserProvider>
    </AuthProvider>
  );
};

export default Providers;
