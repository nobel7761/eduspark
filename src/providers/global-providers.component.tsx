import { FC, PropsWithChildren } from "react";
import AuthProvider from "./auth.provider";

const GlobalProviders: FC<PropsWithChildren> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default GlobalProviders;
